import { Injectable } from '@nestjs/common';

import { WebsiteSpec } from '../../templates/types/website-spec';

import {
  GeneratedPage,
  SiteGenerator,
} from './site-generator.interface';

import { SectionRegistry } from '../section-registry.service';

import { REAL_ESTATE_MODERN_TEMPLATE } from '../templates/real-estate-modern.template';

import { HeroSectionData } from '../sections/hero.section';
import { AboutSectionData } from '../sections/about.section';

@Injectable()
export class RealEstateGenerator
  implements SiteGenerator
{
  readonly templateId =
    REAL_ESTATE_MODERN_TEMPLATE.id;

  readonly templateVersion =
    REAL_ESTATE_MODERN_TEMPLATE.version;

  constructor(
    private readonly sectionRegistry: SectionRegistry,
  ) {}

  generatePages(
    spec: WebsiteSpec,
  ): GeneratedPage[] {
    return spec.pages.map((page) => ({
      key: page.key,
      title: page.title,
      slug: page.slug,
      enabled: page.enabled ?? true,
      content:
        page.key === 'home'
          ? this.generateHomePage(spec)
          : '',
    }));
  }

  private generateHomePage(
    spec: WebsiteSpec,
  ): string {
    const sections =
      REAL_ESTATE_MODERN_TEMPLATE.sections
        .map((sectionId) =>
          this.renderSection(sectionId, spec),
        )
        .filter(Boolean);

    return sections.join('\n\n');
  }

  private renderSection(
    sectionId: string,
    spec: WebsiteSpec,
  ): string {
    switch (sectionId) {
      case 'hero': {
        const section =
          this.sectionRegistry.resolve('hero');

        return section.render({
          title: spec.business.name,
          description:
            spec.business.description ?? '',
          buttonText: 'Get Started',
        } as HeroSectionData);
      }

      case 'about': {
        const section =
          this.sectionRegistry.resolve('about');

        return section.render({
          businessName: spec.business.name,
          location: spec.business.location ?? '',
          description:
            spec.business.description ?? '',
        } as AboutSectionData);
      }

      default:
        return '';
    }
  }
}