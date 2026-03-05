import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus } from '@/common/enums/report-status.enum';
import { PagingResponseDto } from '@/common/dto/paging-response.dto';

export class ReportItemDto {
  @ApiProperty({ example: '1f0e3dad-9993-4f3e-a1b2-56789abcd234' })
  correlationId: string;

  @ApiProperty({ example: '1212121212' })
  codeUc: string;

  @ApiProperty({ example: 'Usina Iguatu' })
  nickname: string;

  @ApiProperty({ example: '2026-01-01', description: 'Format: YYYY-MM-DD' })
  referenceDate: string;

  @ApiProperty({ example: 'Matrix' })
  economicGroup: string;

  @ApiProperty({ example: ReportStatus.READY_TO_SEND, enum: ReportStatus })
  reportStatus: ReportStatus;

  @ApiProperty({ example: '2026-02-24T08:10:40.773Z' })
  updatedAt: string;

  @ApiProperty({ example: '2026-02-24T08:10:40.773Z' })
  ingestedAt: string;

  @ApiProperty({ example: '2026-02-24T08:10:40.773Z' })
  builtAt: string;

  @ApiProperty({ example: '2026-02-24T08:10:40.773Z' })
  sentAt: string;
}

export class ReportsListResponseDto {
  @ApiProperty({ type: () => ReportItemDto, isArray: true })
  response: ReportItemDto[];

  @ApiProperty({ type: () => PagingResponseDto })
  paging: PagingResponseDto;
}
