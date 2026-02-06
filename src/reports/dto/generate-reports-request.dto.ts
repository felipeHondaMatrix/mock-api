import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class GenerateReportsRequestDto {
  @ApiProperty({
    description: 'Array of report IDs to generate. Use ["ALL_REGISTERS"] to generate all reports.',
    example: ['2', '3'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  ids: string[];
}
