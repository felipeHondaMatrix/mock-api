import { ApiProperty } from '@nestjs/swagger';

export class CheckGenerationReportsResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether reports are currently being generated',
  })
  isGeneratingReports: boolean;

  @ApiProperty({
    example: 5,
    description: 'Number of reports with status GENERATING_REPORT',
  })
  generatingCount: number;

  @ApiProperty({
    example: 31,
    description: 'Number of reports with status READY_TO_GENERATE',
  })
  queuedToGenerate: number;

  @ApiProperty({
    example: '02/2026',
    description: 'Current reference month/year (MM/YYYY)',
  })
  currentReferenceDate: string;
}
