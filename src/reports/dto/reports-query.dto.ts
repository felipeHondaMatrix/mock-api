import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsArray, Matches } from 'class-validator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { ReportStatus } from '@/common/enums/report-status.enum';

export enum SortBy {
  REFERENCE_DATE = 'referenceDate',
  CODE_UC = 'codeUc',
  NICKNAME = 'nickname',
  ECONOMIC_GROUP = 'economicGroup',
  REPORT_STATUS = 'reportStatus',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ReportsQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Search term for UC, meter point, or nickname (case-insensitive contains)',
    example: 'SP',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description:
      'Filter by status (can be multiple). Accepts array or comma-separated values. Example: ?status=SENT&status=READY_TO_SEND or ?status=SENT,READY_TO_SEND',
    example: [ReportStatus.READY_TO_GENERATE, ReportStatus.SENT],
    enum: ReportStatus,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const values = Array.isArray(value) ? value : [value];

    return values
      .flatMap((item) =>
        typeof item === 'string' ? item.split(',') : [item],
      )
      .map((item) => (typeof item === 'string' ? item.trim() : item))
      .filter(Boolean);
  })
  @IsArray()
  @IsEnum(ReportStatus, { each: true })
  status?: ReportStatus[];

  @ApiProperty({
    description: 'Start date for filtering reports',
    example: '2026-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in YYYY-MM-DD format',
  })
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering reports',
    example: '2026-02-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be in YYYY-MM-DD format',
  })
  endDate?: string;

  @ApiProperty({
    description: 'Filter by economic group',
    example: ['Grupo Econômico A'],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const values = Array.isArray(value) ? value : [value];

    return values
      .flatMap((item) =>
        typeof item === 'string' ? item.split(',') : [item],
      )
      .map((item) => (typeof item === 'string' ? item.trim() : item))
      .filter(Boolean);
  })
  @IsArray()
  @IsString({ each: true })
  economicGroup?: string[];

  @ApiProperty({
    description: 'Sort by field',
    example: SortBy.REFERENCE_DATE,
    enum: SortBy,
    default: SortBy.REFERENCE_DATE,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortBy)
  orderBy?: SortBy = SortBy.REFERENCE_DATE;

  @ApiProperty({
    description: 'Sort order',
    example: SortOrder.DESC,
    enum: SortOrder,
    default: SortOrder.DESC,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;
}
