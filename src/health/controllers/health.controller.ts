import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from '../services/health.service';
import { CheckBillingResponseDto } from '../dto/check-billing-response.dto';
import { CheckGenerationReportsResponseDto } from '../dto/check-generation-reports-response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('check-billing')
  @ApiOperation({
    summary: 'Check billing process status',
    description:
      'Returns information about the current billing process, including whether it is running, current reference date, and last billing event timestamp.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved billing status',
    type: CheckBillingResponseDto,
    schema: {
      example: {
        isBillingRunning: true,
        currentReferenceDate: '02/2026',
        lastBillingEventAt: '2026-02-04T10:30:00.000Z',
        message: 'Billing process is active with reports being generated',
      },
    },
  })
  checkBilling(): CheckBillingResponseDto {
    return this.healthService.checkBilling();
  }

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
