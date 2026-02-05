import { ApiProperty } from '@nestjs/swagger';

export class PagingResponseDto {
  @ApiProperty({ example: 7, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  pageSize: number;

  @ApiProperty({ example: 20, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: 200, description: 'Total number of items' })
  totalItems: number;
}
