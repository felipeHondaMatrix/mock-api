import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus } from '@/common/enums/report-status.enum';

export class ReportItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'UC-123456' })
  uc: string;

  @ApiProperty({ example: 'MP-987654' })
  meterPoint: string;

  @ApiProperty({ example: 'Unidade Centro' })
  nickname: string;

  @ApiProperty({ example: '01/2024', description: 'Format: MM/YYYY' })
  referenceDate: string;

  @ApiProperty({ example: 'Grupo Econômico A' })
  economicGroup: string;

  @ApiProperty({ example: ReportStatus.SENT, enum: ReportStatus })
  status: ReportStatus;

  @ApiProperty({ example: 'https://api.matrixenergia.com/reports/1' })
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
