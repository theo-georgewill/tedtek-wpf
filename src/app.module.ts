import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { CatalogModule } from './catalog/catalog.module';
import { TemplatesModule } from './templates/templates.module';
import { GenerationModule } from './generation/generation.module';
import { WordpressModule } from './wordpress/wordpress.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProjectsModule,
    CatalogModule,
    TemplatesModule,
    GenerationModule,
    WordpressModule,
  ],
})
export class AppModule {}
