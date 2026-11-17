import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { ProjectStatus } from '@prisma/client';

import { CreateProjectDto } from '../projects/dto/create-project.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { WordpressService } from '../wordpress/wordpress.service';
import { GeneratorRegistry } from './generator-registry.service';
import { WebsiteSpec } from '../templates/types/website-spec';

@Injectable()
export class GenerationService {
  private readonly logger = new Logger(
    GenerationService.name,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly wordpressService: WordpressService,
    private readonly generatorRegistry: GeneratorRegistry,
  ) {}

  health() {
    return {
      status: 'ok',
      mode: 'wordpress',
      message: 'WordPress generation pipeline is ready.',
    };
  }

  async generate(
    projectId: string,
    spec: WebsiteSpec,
  ): Promise<void> {
    this.logger.log(
      `Starting generation for project ${projectId}`,
    );

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        status: ProjectStatus.GENERATING,
      },
    });

    try {
      

      const generator =
        this.generatorRegistry.resolve(
          spec.template.id,
          spec.template.version,
        );

      await this.wordpressService.configureSite({
        business: {
          name: spec.business.name,
          description: spec.business.description,
        },
        websiteSpec: spec,
      });

      await this.wordpressService.syncProperties({
        properties: spec.properties ?? [],
      });

      await this.wordpressService.syncTestimonials({
        testimonials: spec.testimonials ?? [],
      });

      await this.wordpressService.syncTeam({
        team: spec.team ?? [],
      });

      const pages = generator.generatePages(spec);

      await this.wordpressService.syncPages({
        pages,
      });

      await this.prisma.project.update({
        where: { id: projectId },
        data: {
          status: ProjectStatus.PREVIEW,
        },
      });

      await this.prisma.generationJob.updateMany({
        where: { projectId },
        data: {
          status: 'COMPLETED',
        },
      });

      this.logger.log(
        `Generation completed for project ${projectId}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'WordPress generation failed.';

      await this.prisma.project.update({
        where: { id: projectId },
        data: {
          status: ProjectStatus.FAILED,
        },
      });

      await this.prisma.generationJob.updateMany({
        where: { projectId },
        data: {
          status: 'FAILED',
          error: errorMessage,
        },
      });

      this.logger.error(
        `Generation failed for project ${projectId}`,
        error,
      );

      throw error;
    }
  }
}