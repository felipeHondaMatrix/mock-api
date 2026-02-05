import { ApiProperty } from '@nestjs/swagger';

export class CheckBillingResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether billing process is currently running',
  })
  isBillingRunning: boolean;

  @ApiProperty({
    example: '02/2026',
    description: 'Current reference month/year (MM/YYYY)',
  })
  currentReferenceDate: string;

  @ApiProperty({
    example: '2026-02-04T10:30:00.000Z',
    description: 'Timestamp of last billing event',
  })
  lastBillingEventAt: string;

  @ApiProperty({
    example: 'Billing process is active with reports being generated',
  })
  message: string;
}
