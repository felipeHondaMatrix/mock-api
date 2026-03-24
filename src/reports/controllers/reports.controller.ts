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

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  private normalizeQuery(params: ReportsQueryDto): ReportsQueryDto {
    const normalized = { ...params };

    if (!normalized.status?.length && normalized['status[]']?.length) {
      normalized.status = normalized['status[]'];
    }

    if (
      !normalized.economicGroup?.length &&
      normalized['economicGroup[]']?.length
    ) {
      normalized.economicGroup = normalized['economicGroup[]'];
    }

    delete normalized['status[]'];
    delete normalized['economicGroup[]'];

    return normalized;
  }

  @Get()
  @ApiOperation({
    summary: 'List Reports',
    description: 'Returns a list of reports.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved reports list' })
  list(@Query() params: ReportsQueryDto): SearchResultResponseReportResponseDto {
    return this.reportsService.listReports(this.normalizeQuery(params));
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
