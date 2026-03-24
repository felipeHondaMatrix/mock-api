import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { BillingStatusResponseDto } from '../../generated/epr-flow-control-api/model';
import { BillingService } from '../services/billing.service';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('check-billing')
  @ApiOperation({
    summary: 'Get Current Billing Status',
    description:
      'This endpoint returns the current billing status, indicating whether billing is currently running.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current billing status retrieved successfully',
    schema: {
      example: {
        isBillingRunning: true,
      },
    },
  })
  currentStatus(): BillingStatusResponseDto {
    return this.billingService.currentStatus();
  }
}
