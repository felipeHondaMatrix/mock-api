import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from '../services/health.service';
import { CheckBillingResponseDto } from '../dto/check-billing-response.dto';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
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
        currentReferenceDate: '03/2026',
        lastBillingEventAt: '2026-03-05T10:30:00.000Z',
        message: 'Billing process is active with reports being generated',
      },
    },
  })
  checkBilling(): CheckBillingResponseDto {
    return this.healthService.checkBilling();
  }
}
