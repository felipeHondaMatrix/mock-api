import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from '../services/health.service';
import { CheckGenerationReportsResponseDto } from '../dto/check-generation-reports-response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('check-generation-reports')
  @ApiOperation({
    summary: 'Check report generation status',
    description:
      'Returns information about the report generation process, including number of reports being generated, queued to generate, and current reference date.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved generation status',
    type: CheckGenerationReportsResponseDto,
    schema: {
      example: {
        isGeneratingReports: true,
        generatingCount: 5,
        queuedToGenerate: 31,
        currentReferenceDate: '02/2026',
      },
    },
  })
  checkGenerationReports(): CheckGenerationReportsResponseDto {
    return this.healthService.checkGenerationReports();
  }
}
