import { Injectable } from '@nestjs/common';

import { CreateProjectDto } from '../../projects/dto/create-project.dto';
import { WebsiteSpec } from '../../templates/types/website-spec';

import {
  GeneratedPage,
  SiteGenerator,
} from './site-generator.interface';

import { SectionRegistry } from '../section-registry.service';

import { BUSINESS_MODERN_TEMPLATE } from '../templates/business-modern.template';

import { HeroSectionData } from '../sections/hero.section';
import { AboutSectionData } from '../sections/about.section';
import { ServicesSectionData } from '../sections/services.section';

@Injectable()
export class BusinessGenerator
  implements SiteGenerator
{
  readonly templateId =
    BUSINESS_MODERN_TEMPLATE.id;

  readonly templateVersion =
    BUSINESS_MODERN_TEMPLATE.version;

  constructor(
    private readonly sectionRegistry: SectionRegistry,
  ) {}

  generatePages(
    spec: WebsiteSpec,
  ): GeneratedPage[] {
    const dto = 
      data as CreateProjectDto;

    return dto.pages.map((page) => ({
      key: page.key,
      title: page.title,
      slug: page.slug,
      enabled: page.enabled ?? true,
      content:
        page.key === 'home'
          ? this.generateHomePage(dto)
          : '',
    }));
  }

  private generateHomePage(
    dto: CreateProjectDto,
  ): string {
    const sections =
      BUSINESS_MODERN_TEMPLATE.sections.map(
        (sectionId) =>
          this.renderSection(sectionId, dto),
      );

    return sections
      .filter(Boolean)
      .join('\n\n');
  }

  private renderSection(
    sectionId: string,
    dto: CreateProjectDto,
  ): string {
    const section =
      this.sectionRegistry.resolve(sectionId);

    switch (sectionId) {
      case 'hero':
        return section.render({
          title: dto.business.name,
          description: dto.business.description,
          buttonText: 'Contact Us',
        } as HeroSectionData);

      case 'about':
        return section.render({
          businessName: dto.business.name,
          location: dto.business.location,
          description: dto.business.description,
        } as AboutSectionData);

      case 'services':
        return section.render({
          services: dto.content.services ?? [],
        } as ServicesSectionData);

      default:
        throw new Error(
          `Unsupported section "${sectionId}" for business-modern`,
        );
    }
  }
}