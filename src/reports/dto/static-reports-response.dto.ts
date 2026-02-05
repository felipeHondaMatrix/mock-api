import { ApiProperty } from '@nestjs/swagger';

export class SimpleReportRecordDto {
  @ApiProperty({ example: '5827401392' })
  uc: string;

  @ApiProperty({ example: 'CEEC7OENTR102' })
  meterPoint: string;

  @ApiProperty({ example: 'COGERI', description: 'Display name (camel-cased key as required)' })
  nickName: string;

  @ApiProperty({ example: '12/2025', description: 'Format: MM/YYYY' })
  referenceDate: string;

  @ApiProperty({ example: 'Matrix' })
  economicGroup: string;

  @ApiProperty({ example: 'Enviado' })
  status: string;
}

export class SimpleReportsResponseDto {
  @ApiProperty({ type: () => SimpleReportRecordDto, isArray: true })
  records: SimpleReportRecordDto[];
}

export class SimpleReportsEnvelopeDto {
  @ApiProperty({ type: () => SimpleReportsResponseDto })
  response: SimpleReportsResponseDto;
}
