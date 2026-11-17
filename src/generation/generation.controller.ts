import { Controller, Get } from '@nestjs/common';
import { GenerationService } from './generation.service';

@Controller('generation')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Get('health')
  health() {
    return this.generationService.health();
  }
}
