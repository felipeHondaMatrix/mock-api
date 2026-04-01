import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type {
  ReportGenerateResponseDto,
  ReportGenerateRequestDto,
  ReportSummaryResponseDto,
  SearchResultResponseReportResponseDto,
  SummaryParams,
} from '@/generated/epr-flow-control-api/model';
import { ReportsService } from '../services/reports.service';
import { ReportsQueryDto } from '../dto/reports-query.dto';
import { ReportVersionsResponseDto } from '../dto/report-versions-response.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({
    summary: 'List Reports',
    description: 'Returns a list of reports.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved reports list' })
  list(@Query() params: ReportsQueryDto): SearchResultResponseReportResponseDto {
    return this.reportsService.listReports(params);
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Report Summary',
    description: 'Returns a summary of reports for a given reference date.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved report summary' })
  async summary(@Query() params: SummaryParams): Promise<ReportSummaryResponseDto> {
    return this.reportsService.getSummary(params.referenceDate);
  }

  @Get(':correlationId/versions')
  @ApiOperation({
    summary: 'List report versions by correlationId',
    description: 'Returns the mocked list of versions for a specific report correlationId.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved report versions', type: ReportVersionsResponseDto })
  @ApiResponse({ status: 404, description: 'Report not found' })
  versions(@Param('correlationId') correlationId: string): ReportVersionsResponseDto {
    return this.reportsService.getVersions(correlationId);
  }

  @Post('generate')
  @HttpCode(202)
  @ApiOperation({
    summary: 'Generate Reports',
    description: 'Triggers the generation of reports and sends them to the processing queue.',
  })
  @ApiResponse({ status: 202, description: 'Reports generation initiated successfully' })
  async generate(@Body() body: ReportGenerateRequestDto): Promise<ReportGenerateResponseDto> {
    return this.reportsService.generate(body.referenceDate);
  }

  @Post(':correlationId/generate')
  @HttpCode(202)
  @ApiOperation({
    summary: 'Generate Report by correlationId',
    description: 'Triggers the generation of a report for a specific correlationId and sends it to the processing queue.',
  })
  @ApiResponse({ status: 202, description: 'Report generation initiated successfully' })
  async generateByCorrelationId(
    @Param('correlationId') correlationId: string,
    @Body() body: ReportGenerateRequestDto,
  ): Promise<ReportGenerateResponseDto> {
    return this.reportsService.generate(body.referenceDate, correlationId);
  }
}
