import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus } from '@/common/enums/report-status.enum';

export class ReportItemDto {
  @ApiProperty({ example: 200 })
  id: number;

  @ApiProperty({ example: 'UC-SP-000200' })
  uc: string;

  @ApiProperty({ example: 'MP-00000200' })
  meterPoint: string;

  @ApiProperty({ example: 'Unidade Shopping 1' })
  nickname: string;

  @ApiProperty({ example: '10/2025', description: 'Format: MM/YYYY' })
  referenceDate: string;

  @ApiProperty({ example: 'Grupo Econômico A' })
  economicGroup: string;

  @ApiProperty({ example: ReportStatus.READY_TO_SEND, enum: ReportStatus })
  status: ReportStatus;

  @ApiProperty({ example: 'https://api.matrixenergia.com/reports/200' })
  url: string;
}

export class ReportsResponseDto {
  @ApiProperty({
    type: () => ReportItemDto,
    isArray: true,
    description: 'List of report items',
  })
  records: ReportItemDto[];
}

export class ReportsListResponseDto {
  @ApiProperty({ type: () => ReportsResponseDto })
  response: ReportsResponseDto;

  @ApiProperty({
    type: 'object',
    properties: {
      page: { type: 'number', example: 7 },
      pageSize: { type: 'number', example: 10 },
      totalPages: { type: 'number', example: 20 },
      totalItems: { type: 'number', example: 200 },
    },
  })
  paging: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}
