import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({
    description: 'Name of the generated report file',
    example: 'relatorio-uc-sp-000001-2026-03.pdf',
    required: false,
  })
  fileName?: string;

  @ApiProperty({
    description: 'Public URL used to download the file',
    example: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    required: false,
  })
  downloadUrl?: string;

  @ApiProperty({
    description: 'User or process that generated the file',
    example: 'mock.api',
    required: false,
  })
  createdBy?: string;

  @ApiProperty({
    description: 'Last file update timestamp',
    example: '2026-03-26T12:00:00.000Z',
    required: false,
  })
  updatedAt?: string;
}
