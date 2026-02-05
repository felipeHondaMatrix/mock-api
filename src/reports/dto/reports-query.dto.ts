import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsInt, Min, Max, IsArray } from 'class-validator';
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
    example: 'SP-001',
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
  @Type(() => String)
  @IsArray()
  @IsEnum(ReportStatus, { each: true })
  status?: ReportStatus[];

  @ApiProperty({
    description: 'Filter by reference month (1-12)',
    example: 1,
    minimum: 1,
    maximum: 12,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  referenceMonth?: number;

  @ApiProperty({
    description: 'Filter by reference year',
    example: 2024,
    minimum: 2000,
    maximum: 2100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  referenceYear?: number;

  @ApiProperty({
    description: 'Filter by economic group (contains, case-insensitive)',
    example: 'Group A',
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
