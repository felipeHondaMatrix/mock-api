import { ApiProperty } from '@nestjs/swagger';

export class PagingResponseDto {
  @ApiProperty({ example: 3, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: 22, description: 'Total number of elements' })
  totalElements: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Elements per page' })
  elementsPerPage: number;
}
