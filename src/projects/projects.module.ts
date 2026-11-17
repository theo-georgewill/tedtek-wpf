import { Module } from '@nestjs/common';

import { CatalogModule } from '../catalog/catalog.module';
import { GenerationModule } from '../generation/generation.module';
import { TemplatesModule } from '../templates/templates.module';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    TemplatesModule,
    CatalogModule,
    GenerationModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}