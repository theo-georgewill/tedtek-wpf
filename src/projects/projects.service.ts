import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Plan, ProjectStatus } from '@prisma/client';

import { CatalogService } from '../catalog/catalog.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { GenerationService } from '../generation/generation.service';
import { TemplatesService } from '../templates/templates.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { WebsiteSpec } from '../templates/types/website-spec';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly templatesService: TemplatesService,
    private readonly catalogService: CatalogService,
    private readonly generationService: GenerationService,
  ) {}

  async create(dto: CreateProjectDto) {
    /*
     * 1. Resolve and validate the requested template.
     */
    const template = this.templatesService.resolve(
      dto.template.id,
      dto.template.version,
    );


    if (!template) {
      throw new BadRequestException(
        'Template or template version not found',
      );
    }

    const defaultWebsiteSpec =
      this.templatesService.buildDefaultWebsiteSpec(
        template,
      );

      const websiteSpec: WebsiteSpec = {
        ...defaultWebsiteSpec,

        business: {
          name: dto.business.name,
          description: dto.business.description,
          industry: dto.business.industry,
          location: dto.business.location,
        },

        contact: {
          fullName: dto.contact.fullName,
          email: dto.contact.email,
          phone: dto.contact.phone,
          whatsapp: dto.contact.whatsapp,
          address: dto.contact.address,
        },

        branding: {
          logoName: dto.branding.logoName,
          primaryColor: dto.branding.primaryColor,
          secondaryColor: dto.branding.secondaryColor,
          font: dto.branding.font,
        },

        pages: dto.pages.map((page) => ({
          key: page.key,
          title: page.title,
          slug: page.slug,
          enabled: page.enabled,
        })),

        features: {
          forms: dto.features.forms,
          booking: dto.features.booking,
          ecommerce: dto.features.ecommerce,
          blog: dto.features.blog,
          analytics: dto.features.analytics,
        },

        content: {
          services: dto.content.services,
          notes: dto.content.notes,
        },

        properties: dto.properties ?? [],

        testimonials: dto.testimonials ?? [],

        team: dto.team ?? [],

        domain: dto.domain
          ? {
              custom: dto.domain.custom,
              name: dto.domain.name,
            }
          : undefined,
      };
    
    /*
     * 2. Resolve the plan.
     */
    const plan = dto.plan ?? Plan.FREE;

    /*
     * 3. Validate page limits.
     */
    const selectedPages = dto.pages ?? [];

    const maxPages = this.templatesService.maxPagesForPlan(
      template,
      plan,
    );

    if (selectedPages.length > maxPages) {
      throw new BadRequestException(
        `Plan ${plan} allows a maximum of ${maxPages} page(s)`,
      );
    }

    /*
     * 4. Resolve requested add-ons.
     */
    const requestedAddonIds = dto.addonIds ?? [];

    const addons = this.catalogService.resolveAddons(
      requestedAddonIds,
    );

    /*
     * 5. Create the project and its generation job.
     *
     * Generation itself is deliberately handled by
     * GenerationService.
     */
    const project = await this.prisma.project.create({
      data: {
        status: ProjectStatus.QUEUED,
        plan,
        templateId: template.id,
        templateVersion: template.version,
        websiteSpec: websiteSpec,

        addons: {
          create: addons.map((addon) => ({
            addonId: addon.id,
            price: addon.price,
          })),
        },

        generationJobs: {
          create: {
            status: 'QUEUED',
          },
        },
      },

      include: {
        addons: true,
        generationJobs: true,
      },
    });

    /*
     * 6. Hand the project over to the generation pipeline.
     *
     * ProjectsService does not generate pages or talk to WordPress.
     */
    await this.generationService.generate(
      project.id,
      websiteSpec,
    );

    /*
     * 7. Reload the project so the response reflects the
     * final generation state.
     */
    const generatedProject =
      await this.prisma.project.findUniqueOrThrow({
        where: {
          id: project.id,
        },

        include: {
          addons: true,
          generationJobs: true,
        },
      });

    return {
      id: generatedProject.id,

      status: generatedProject.status,

      template: {
        id: generatedProject.templateId,
        version: generatedProject.templateVersion,
      },

      addons: generatedProject.addons.map((item) => ({
        id: item.addonId,
        price: item.price,
      })),

      generationJobId:
        generatedProject.generationJobs[0]?.id ?? null,
    };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },

      include: {
        addons: true,
        generationJobs: true,
      },
    });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    return project;
  }

  async getStatus(id: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        status: true,
        previewUrl: true,
        productionUrl: true,
        updatedAt: true,
      },
    });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    const progress: Record<ProjectStatus, number> = {
      DRAFT: 0,
      QUEUED: 10,
      GENERATING: 50,
      PREVIEW: 100,
      PUBLISHED: 100,
      FAILED: 0,
    };

    return {
      ...project,
      progress: progress[project.status],
    };
  }
}