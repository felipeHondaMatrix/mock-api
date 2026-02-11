import { ApiProperty } from '@nestjs/swagger';
import { PagingResponseDto } from '@/common/dto/paging-response.dto';

export class SimpleReportRecordDto {
  @ApiProperty({ example: 200 })
  id: number;

  @ApiProperty({ example: 'UC-SP-000200' })
  uc: string;

  @ApiProperty({ example: 'MP-00000200' })
  meterPoint: string;

  @ApiProperty({ example: 'Unidade Shopping 1', description: 'Display name (camel-cased key as required)' })
  nickName: string;

  @ApiProperty({ example: '10/2025', description: 'Format: MM/YYYY' })
  referenceDate: string;

  @ApiProperty({ example: 'Grupo Econômico A' })
  economicGroup: string;

  @ApiProperty({ example: 'READY_TO_SEND' })
  status: string;
}

export class SimpleReportsResponseDto {
  @ApiProperty({ type: () => SimpleReportRecordDto, isArray: true })
  records: SimpleReportRecordDto[];
}

export class SimpleReportsEnvelopeDto {
  @ApiProperty({ type: () => SimpleReportsResponseDto })
  response: SimpleReportsResponseDto;

  @ApiProperty({ type: () => PagingResponseDto })
  paging: PagingResponseDto;
}
