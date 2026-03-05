import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from '../services/reports.service';
import { ResumeReportsResponseDto } from '../dto/resume-reports-response.dto';
import { ResumeReportsEnvelopeDto } from '../dto/resume-reports-envelope.dto';
import { ResumeReportsByDateEnvelopeDto } from '../dto/resume-reports-by-date.dto';
import { SimpleReportsEnvelopeDto } from '../dto/static-reports-response.dto';
import { ReportsQueryDto } from '../dto/reports-query.dto';
import { GenerateReportsRequestDto } from '../dto/generate-reports-request.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get list of reports with pagination and filters',
    description: 'Returns a paginated and filtered list of reports. Supports search, status filtering, reference date filtering, economic group filtering, and sorting.',
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
              id: 200,
              uc: 'UC-SP-000200',
              meterPoint: 'MP-00000200',
              nickName: 'Unidade Shopping 1',
              referenceDate: '10/2025',
              economicGroup: 'Grupo Econômico A',
              status: 'READY_TO_SEND',
            },
            {
              id: 199,
              uc: 'UC-GO-000199',
              meterPoint: 'MP-99000199',
              nickName: 'Depósito Matriz 100',
              referenceDate: '10/2025',
              economicGroup: 'Grupo Econômico E',
              status: 'READY_TO_SEND',
            },
          ],
        },
        paging: {
          page: 1,
          pageSize: 10,
          totalPages: 20,
          totalItems: 200,
        },
      },
    },
  })
  listReports(@Query() query: ReportsQueryDto): SimpleReportsEnvelopeDto {
    const result = this.reportsService.listReports(query);
    
    // Transform to SimpleReportsEnvelopeDto format
    return {
      response: {
        records: result.response.records.map(record => ({
          id: record.id,
          uc: record.uc,
          meterPoint: record.meterPoint,
          nickName: record.nickname,
          referenceDate: record.referenceDate,
          economicGroup: record.economicGroup,
          status: record.status,
        })),
      },
      paging: result.paging,
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

  @Post('generate-reports')
  @ApiOperation({
    summary: 'Generate reports',
    description:
      'Generate reports by specific IDs or all registers. Pass ["ALL_REGISTERS"] to generate all reports, or pass an array of report IDs like ["2", "3"].',
  })
  @ApiResponse({
    status: 200,
    description: 'Reports generation initiated successfully',
    schema: {
      example: {
        message: 'Reports generation initiated for 2 report(s)',
        generatedCount: 2,
      },
    },
  })
  generateReports(
    @Body() body: GenerateReportsRequestDto,
  ): { message: string; generatedCount: number } {
    return this.reportsService.generateReports(body.ids);
  }

  @Post('send')
  @ApiOperation({
    summary: 'Send reports',
    description:
      'Send reports by specific IDs or all registers. Pass ["ALL_REGISTERS"] to send all reports, or pass an array of report IDs like ["2", "3"].',
  })
  @ApiResponse({
    status: 200,
    description: 'Reports sending initiated successfully',
    schema: {
      example: {
        message: 'Reports sending initiated for 2 report(s)',
        sentCount: 2,
      },
    },
  })
  sendReports(
    @Body() body: GenerateReportsRequestDto,
  ): { message: string; sentCount: number } {
    return this.reportsService.sendReports(body.ids);
  }

  @Post('download')
  @ApiOperation({
    summary: 'Download reports',
    description:
      'Download reports by specific IDs or all registers. Pass ["ALL_REGISTERS"] to download all reports, or pass an array of report IDs like ["2", "3"].',
  })
  @ApiResponse({
    status: 200,
    description: 'Reports download initiated successfully',
    schema: {
      example: {
        message: 'Reports download initiated for 2 report(s)',
        downloadCount: 2,
      },
    },
  })
  downloadReports(
    @Body() body: GenerateReportsRequestDto,
  ): { message: string; downloadCount: number } {
    return this.reportsService.downloadReports(body.ids);
  }
}
