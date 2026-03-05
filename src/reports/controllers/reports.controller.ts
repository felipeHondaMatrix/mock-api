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
        response: [
          {
            correlationId: '1f0e3dad-9993-4f3e-a1b2-56789abcd234',
            codeUc: '1212121212',
            nickname: 'Usina Iguatu',
            referenceDate: '2026-01-01',
            economicGroup: 'Matrix',
            reportStatus: 'QUEUED_FOR_SENDING',
            updatedAt: '2026-02-24T08:10:40.773Z',
            ingestedAt: '2026-02-24T08:10:40.773Z',
            builtAt: '2026-02-24T08:10:40.773Z',
            sentAt: '2026-02-24T08:10:40.773Z',
          },
        ],
        paging: {
          totalPages: 20,
          totalElements: 200,
          page: 1,
          elementsPerPage: 10,
        },
      },
    },
  })
  listReports(@Query() query: ReportsQueryDto): SimpleReportsEnvelopeDto {
    return this.reportsService.listReports(query);
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

  @Post('generate')
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
