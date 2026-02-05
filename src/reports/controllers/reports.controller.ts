import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
    description:
      'Returns a fixed list of reports matching the required response format.',
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

  @Get('resume-reports')
  @ApiOperation({
    summary: 'Get resume statistics of reports',
    description:
      'Returns a summary with statistics about reports including sent percentage, reports to generate, pending corrections, ready to send, and sent reports.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved reports resume',
    type: ResumeReportsResponseDto,
    schema: {
      example: {
        sentReportsPercentage: 4.6,
        reportsToGenerate: 31,
        reportsPendingCorrection: 12,
        reportsReadyToSend: 1801,
        reportsSent: 90,
      },
    },
  })
  getResume(): ResumeReportsResponseDto {
    return this.reportsService.getResume();
  }
  @Get('dashboard-resume')
  @ApiOperation({
    summary: 'Get dashboard resume statistics of reports',
    description:
      'Returns a resume envelope for dashboard consumption with sent percentage, reports to generate, pending corrections, ready to send, and sent reports.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved dashboard resume',
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
  getDashboardResume(): ResumeReportsEnvelopeDto {
    return { response: this.reportsService.getResume() };
  }

  @Get('resume-reports-by-date')
  @ApiOperation({
    summary: 'Get resume statistics of reports grouped by reference date',
    description:
      'Returns a list of resume statistics grouped by reference date, providing detailed breakdown for each month/year with sent percentage, reports to generate, pending corrections, ready to send, sent reports, and total reports.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved reports resume grouped by reference date',
    type: ResumeReportsByDateEnvelopeDto,
    schema: {
      example: {
        response: {
          records: [
            {
              referenceDate: '12/2025',
              sentReportsPercentage: 4.6,
              reportsToGenerate: 31,
              reportsPendingCorrection: 12,
              reportsReadyToSend: 1801,
              reportsSent: 90,
              totalReports: 1934,
            },
            {
              referenceDate: '11/2025',
              sentReportsPercentage: 5.2,
              reportsToGenerate: 28,
              reportsPendingCorrection: 14,
              reportsReadyToSend: 1750,
              reportsSent: 102,
              totalReports: 1894,
            },
            {
              referenceDate: '10/2025',
              sentReportsPercentage: 3.8,
              reportsToGenerate: 35,
              reportsPendingCorrection: 10,
              reportsReadyToSend: 1820,
              reportsSent: 75,
              totalReports: 1940,
            },
          ],
        },
      },
    },
  })
  getResumeByReferenceDates(): ResumeReportsByDateEnvelopeDto {
    return { response: this.reportsService.getResumeByReferenceDates() };
  }
}
