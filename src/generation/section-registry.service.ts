import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { SiteSection } from './sections/site-section.interface';
import { HeroSection } from './sections/hero.section';
import { AboutSection } from './sections/about.section';
import { ServicesSection } from './sections/services.section';

@Injectable()
export class SectionRegistry {
  private readonly sections: SiteSection[];

  constructor(
    heroSection: HeroSection,
    aboutSection: AboutSection,
    servicesSection: ServicesSection,
  ) {
    this.sections = [
      heroSection,
      aboutSection,
      servicesSection,
    ];
  }

  resolve(sectionId: string): SiteSection {
    const section = this.sections.find(
      (item) => item.id === sectionId,
    );

    if (!section) {
      throw new BadRequestException(
        `No section found with id "${sectionId}"`,
      );
    }

    return section;
  }
}