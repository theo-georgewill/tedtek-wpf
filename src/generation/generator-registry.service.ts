import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { BusinessGenerator } from './generators/business.generator';
import { SiteGenerator } from './generators/site-generator.interface';
import { RealEstateGenerator } from './generators/real-estate.generator';

@Injectable()
export class GeneratorRegistry {
  private readonly generators: SiteGenerator[];

  constructor(
    realEstateGenerator: RealEstateGenerator,
    businessGenerator: BusinessGenerator,
  ) {
    this.generators = [
      realEstateGenerator,
      businessGenerator,
    ];
  }

  resolve(
    templateId: string, 
    templateVersion: string
  ): SiteGenerator {
    const generator = this.generators.find(
      (item) => 
        item.templateId === templateId && 
        item.templateVersion === templateVersion,
    );

    if (!generator) {
      throw new BadRequestException(
        `No generator found for template "${templateId}" with version "${templateVersion}"`,
      );
    }

    return generator;
  }
}