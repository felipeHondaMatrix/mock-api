import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsArray, Matches } from 'class-validator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { ReportStatus } from '@/common/enums/report-status.enum';

export enum SortBy {
  ID = 'id',
  REFERENCE_DATE = 'referenceDate',
  NICKNAME = 'nickname',
  STATUS = 'status',
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
    if (Array.isArray(value)) {
      return value;
    }
    return value ? [value] : undefined;
  })
  @IsArray()
  @IsEnum(ReportStatus, { each: true })
  status?: ReportStatus[];

  @ApiProperty({
    description: 'Filter by reference date in YYYY-MM-DD format. Only year and month components are used for filtering (day is ignored).',
    example: '2025-10-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { 
    message: 'referenceDate must be in YYYY-MM-DD format' 
  })
  referenceDate?: string;

  @ApiProperty({
    description: 'Filter by economic group (contains, case-insensitive)',
    example: 'Grupo Econômico',
    required: false,
  })
  @IsOptional()
  @IsString()
  economicGroup?: string;

  @ApiProperty({
    description: 'Sort by field',
    example: SortBy.ID,
    enum: SortBy,
    default: SortBy.ID,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.ID;

  @ApiProperty({
    description: 'Sort order',
    example: SortOrder.DESC,
    enum: SortOrder,
    default: SortOrder.DESC,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
