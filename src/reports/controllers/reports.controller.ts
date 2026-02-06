import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from '../services/reports.service';
import { ResumeReportsResponseDto } from '../dto/resume-reports-response.dto';
import { ResumeReportsEnvelopeDto } from '../dto/resume-reports-envelope.dto';
import { ResumeReportsByDateEnvelopeDto } from '../dto/resume-reports-by-date.dto';
import { SimpleReportsEnvelopeDto } from '../dto/static-reports-response.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get list of reports (static example)',
    description: 'Returns a fixed list of reports matching the required response format.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved reports list',
    type: SimpleReportsEnvelopeDto,
    schema: {
      example: {
        response: {
          records: [
            {
              uc: '5827401392',
              meterPoint: 'CEEC7OENTR102',
              nickName: 'COGERI',
              referenceDate: '12/2025',
              economicGroup: 'Matrix',
              status: 'Enviado',
            },
            {
              uc: '5827401392',
              meterPoint: 'CEEC7OENTR102',
              nickName: 'COGERI',
              referenceDate: '11/2025',
              economicGroup: 'Matrix',
              status: 'Informações pendentes',
            },
            {
              uc: '5827401392',
              meterPoint: 'CEEC7OENTR102',
              nickName: 'COGERI',
              referenceDate: '10/2025',
              economicGroup: 'Matrix',
              status: 'Enviado',
            },
            {
              uc: '5827401392',
              meterPoint: 'CEEC7OENTR102',
              nickName: 'COGERI',
              referenceDate: '09/2025',
              economicGroup: 'Matrix',
              status: 'Gerando relatório',
            },
            {
              uc: '5827401392',
              meterPoint: 'CEEC7OENTR102',
              nickName: 'COGERI',
              referenceDate: '08/2025',
              economicGroup: 'Matrix',
              status: 'Necessita análise',
            },
            {
              uc: '5827401392',
              meterPoint: 'CEEC7OENTR102',
              nickName: 'COGERI',
              referenceDate: '07/2025',
              economicGroup: 'Matrix',
              status: 'Erro no envio',
            },
            {
              uc: '5827401392',
              meterPoint: 'CEEC7OENTR102',
              nickName: 'COGERI',
              referenceDate: '06/2025',
              economicGroup: 'Matrix',
              status: 'Pronto para enviar',
            },
            {
              uc: '5827401392',
              meterPoint: 'CEEC7OENTR102',
              nickName: 'COGERI',
              referenceDate: '05/2025',
              economicGroup: 'Matrix',
              status: 'Erro no processamento',
            },
            {
              uc: '5827401392',
              meterPoint: 'CEEC7OENTR102',
              nickName: 'COGERI',
              referenceDate: '04/2025',
              economicGroup: 'Matrix',
              status: 'Enviado',
            },
            {
              uc: '5827401392',
              meterPoint: 'CEEC7OENTR102',
              nickName: 'COGERI',
              referenceDate: '03/2025',
              economicGroup: 'Matrix',
              status: 'Aguardando processamento',
            },
          ],
        },
      },
    },
  })
  listReports(): SimpleReportsEnvelopeDto {
    return {
      response: {
        records: [
          {
            uc: '5827401392',
            meterPoint: 'CEEC7OENTR102',
            nickName: 'COGERI',
            referenceDate: '12/2025',
            economicGroup: 'Matrix',
            status: 'Enviado',
          },
          {
            uc: '5827401392',
            meterPoint: 'CEEC7OENTR102',
            nickName: 'COGERI',
            referenceDate: '11/2025',
            economicGroup: 'Matrix',
            status: 'Informações pendentes',
          },
          {
            uc: '5827401392',
            meterPoint: 'CEEC7OENTR102',
            nickName: 'COGERI',
            referenceDate: '10/2025',
            economicGroup: 'Matrix',
            status: 'Enviado',
          },
          {
            uc: '5827401392',
            meterPoint: 'CEEC7OENTR102',
            nickName: 'COGERI',
            referenceDate: '09/2025',
            economicGroup: 'Matrix',
            status: 'Gerando relatório',
          },
          {
            uc: '5827401392',
            meterPoint: 'CEEC7OENTR102',
            nickName: 'COGERI',
            referenceDate: '08/2025',
            economicGroup: 'Matrix',
            status: 'Necessita análise',
          },
          {
            uc: '5827401392',
            meterPoint: 'CEEC7OENTR102',
            nickName: 'COGERI',
            referenceDate: '07/2025',
            economicGroup: 'Matrix',
            status: 'Erro no envio',
          },
          {
            uc: '5827401392',
            meterPoint: 'CEEC7OENTR102',
            nickName: 'COGERI',
            referenceDate: '06/2025',
            economicGroup: 'Matrix',
            status: 'Pronto para enviar',
          },
          {
            uc: '5827401392',
            meterPoint: 'CEEC7OENTR102',
            nickName: 'COGERI',
            referenceDate: '05/2025',
            economicGroup: 'Matrix',
            status: 'Erro no processamento',
          },
          {
            uc: '5827401392',
            meterPoint: 'CEEC7OENTR102',
            nickName: 'COGERI',
            referenceDate: '04/2025',
            economicGroup: 'Matrix',
            status: 'Enviado',
          },
          {
            uc: '5827401392',
            meterPoint: 'CEEC7OENTR102',
            nickName: 'COGERI',
            referenceDate: '03/2025',
            economicGroup: 'Matrix',
            status: 'Aguardando processamento',
          },
        ],
      },
    };
  }

  // @Get('resume-reports')
  // @ApiOperation({
  //   summary: 'Get resume statistics of reports',
  //   description:
  //     'Returns a summary with statistics about reports including sent percentage, reports to generate, pending corrections, ready to send, and sent reports.',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Successfully retrieved reports resume',
  //   type: ResumeReportsResponseDto,
  //   schema: {
  //     example: {
  //       sentReportsPercentage: 4.6,
  //       reportsToGenerate: 31,
  //       reportsPendingCorrection: 12,
  //       reportsReadyToSend: 1801,
  //       reportsSent: 90,
  //     },
  //   },
  // })
  // getResume(): ResumeReportsResponseDto {
  //   return this.reportsService.getResume();
  // }

  @Get('resume-reports')
  @ApiOperation({
    summary: 'Get resume statistics of reports',
    description:
      'Returns a summary with statistics about reports including sent percentage, reports to generate, pending corrections, ready to send, and sent reports. Optionally filter by a specific reference date using YYYY-MM-DD format (day component is ignored, only year and month are used for filtering).',
  })
  @ApiQuery({
    name: 'referenceDate',
    required: false,
    description:
      'Optional reference date filter in YYYY-MM-DD format. Only year and month are used for filtering (day is ignored). Example: 2025-12-01 will filter for December 2025.',
    type: String,
    example: '2025-12-01',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved reports resume',
    type: ResumeReportsEnvelopeDto,
    schema: {
      example: {
        response: {
          sentReportsPercentage: 4.6,
          reportsToGenerate: 31,
          reportsPendingCorrection: 12,
          reportsReadyToSend: 1801,
          reportsSent: 90,
        },
      },
    },
  })
  getResumeByReferenceDates(
    @Query('referenceDate') referenceDate?: string,
  ): ResumeReportsEnvelopeDto {
    // Convert YYYY-MM-DD to MM/YYYY format if provided
    let formattedDate: string | undefined;
    if (referenceDate) {
      const [year, month] = referenceDate.split('-');
      formattedDate = `${month}/${year}`;
    }

    return { response: this.reportsService.getDashboardResume(formattedDate) };
  }
}
