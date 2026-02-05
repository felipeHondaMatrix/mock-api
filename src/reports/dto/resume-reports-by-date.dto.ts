import { ApiProperty } from '@nestjs/swagger';

export class ResumeReportByDateDto {
  @ApiProperty({
    example: '12/2025',
    description: 'Reference date in format MM/YYYY',
  })
  referenceDate: string;

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

  @ApiProperty({
    example: 1934,
    description: 'Total number of reports for this reference date',
  })
  totalReports: number;
}

export class ResumeReportsByDateResponseDto {
  @ApiProperty({
    type: [ResumeReportByDateDto],
    description: 'Array of resume statistics grouped by reference date',
  })
  records: ResumeReportByDateDto[];
}

export class ResumeReportsByDateEnvelopeDto {
  @ApiProperty({
    type: ResumeReportsByDateResponseDto,
    description: 'Resume statistics of reports grouped by reference date',
  })
  response: ResumeReportsByDateResponseDto;
}
