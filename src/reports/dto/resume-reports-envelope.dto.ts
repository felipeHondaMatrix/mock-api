import { ApiProperty } from '@nestjs/swagger';
import { ResumeReportsResponseDto } from './resume-reports-response.dto';

export class ResumeReportsEnvelopeDto {
  @ApiProperty({
    type: ResumeReportsResponseDto,
    description: 'Resume statistics of reports',
  })
  response: ResumeReportsResponseDto;
}
