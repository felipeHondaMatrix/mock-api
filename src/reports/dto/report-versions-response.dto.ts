import { ApiProperty } from '@nestjs/swagger';

export class ReportVersionsResponseDto {
  @ApiProperty({
    description: 'Correlation ID of the report',
    example: 'mock-correlation-000001',
  })
  correlationId: string;

  @ApiProperty({
    description: 'List of versions available for the report',
    example: ['1.0.0'],
    isArray: true,
    type: String,
  })
  versions: string[];
}
