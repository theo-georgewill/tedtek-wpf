import { Module } from '@nestjs/common';

import { GenerationService } from './generation.service';
import { GenerationController } from './generation.controller';
import { WordpressModule } from '../wordpress/wordpress.module';

import { GeneratorRegistry } from './generator-registry.service';
import { SectionRegistry } from './section-registry.service';

import { RealEstateGenerator } from './generators/real-estate.generator';
import { BusinessGenerator } from './generators/business.generator';

import { HeroSection } from './sections/hero.section';
import { AboutSection } from './sections/about.section';
import { ServicesSection } from './sections/services.section';

@Module({
  imports: [WordpressModule],
  controllers: [GenerationController],
  providers: [
    GenerationService,

    GeneratorRegistry,
    SectionRegistry,

    RealEstateGenerator,
    BusinessGenerator,

    HeroSection,
    AboutSection,
    ServicesSection,
  ],
  exports: [GenerationService],
})
export class GenerationModule {}