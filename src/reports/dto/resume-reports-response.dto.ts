import { ApiProperty } from '@nestjs/swagger';

export class ResumeReportsResponseDto {
  @ApiProperty({
    example: 4.6,
    description: 'Percentage of sent reports (1 decimal place)',
  })
  sentReportsPercentage: number;

  @ApiProperty({
    example: 31,
    description: 'Number of reports with status READY_TO_GENERATE',
  })
  reportsToGenerate: number;

  @ApiProperty({
    example: 12,
    description: 'Number of reports with status INFORMATION_PENDING or NEEDS_ANALYSIS',
  })
  reportsPendingCorrection: number;

  @ApiProperty({
    example: 1801,
    description: 'Number of reports with status READY_TO_SEND',
  })
  reportsReadyToSend: number;

  @ApiProperty({
    example: 90,
    description: 'Number of reports with status SENT',
  })
  reportsSent: number;
}
