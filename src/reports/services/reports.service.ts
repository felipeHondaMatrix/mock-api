import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportsRepository } from '../repositories/reports.repository';
import { ReportsQueryDto, SortBy, SortOrder } from '../dto/reports-query.dto';
import { Report } from '@/common/interfaces/report.interface';
import { ReportStatus } from '@/common/enums/report-status.enum';
import { ResumeReportsResponseDto } from '../dto/resume-reports-response.dto';
import { ResumeReportByDateDto, ResumeReportsByDateResponseDto } from '../dto/resume-reports-by-date.dto';
import type {
  ReportGenerateResponseDto,
  ReportResponseDto,
  ReportSummaryResponseDto,
  SearchResultResponseReportResponseDto,
} from '@/generated/epr-flow-control-api/model';
import { ReportVersionsResponseDto } from '../dto/report-versions-response.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  /**
   * Get paginated and filtered list of reports
   */
  listReports(query: ReportsQueryDto): SearchResultResponseReportResponseDto {
    let reports = this.reportsRepository.findAll();

    // Apply filters
    reports = this.applyFilters(reports, query);

    // Apply sorting
    reports = this.applySorting(reports, query.orderBy, query.order);

    // Calculate pagination
    const totalItems = reports.length;
    const totalPages = Math.ceil(totalItems / query.pageSize);
    const normalizedPage = query.page < 0 ? 0 : query.page;
    const startIndex = normalizedPage * query.pageSize;
    const endIndex = startIndex + query.pageSize;

    // Get paginated records
    const paginatedReports = reports.slice(startIndex, endIndex);

    // Transform to response format
    const response = paginatedReports.map((report) => this.toReportResponse(report));

    return {
      response,
      paging: {
        page: query.page,
        elementsPerPage: query.pageSize,
        totalPages,
        totalElements: totalItems,
      },
    };
  }

  getSummary(referenceDate: string): ReportSummaryResponseDto {
    const summary = this.getDashboardResume(referenceDate);

    return {
      totalReports:
        summary.reportsToGenerate +
        summary.reportsPendingCorrection +
        summary.reportsReadyToSend +
        summary.reportsSent,
      sentReportsPercentage: summary.sentReportsPercentage,
      reportsToGenerate: summary.reportsToGenerate,
      reportsPendingCorrection: summary.reportsPendingCorrection,
      reportsReadyToSend: summary.reportsReadyToSend,
      reportsSent: summary.reportsSent,
    };
  }

  generate(referenceDate: string, correlationId?: string): ReportGenerateResponseDto {
    const normalizedCorrelationId =
      correlationId ?? `mock-${referenceDate}-${Date.now()}`;

    return {
      correlationId: normalizedCorrelationId,
      message: correlationId
        ? 'Report sent to queue'
        : 'Reports sent to queue',
    };
  }

  getVersions(correlationId: string): ReportVersionsResponseDto {
    const report = this.reportsRepository.findByCorrelationId(correlationId);

    if (!report) {
      throw new NotFoundException(`Report ${correlationId} not found`);
    }

    const month = String(report.referenceMonth).padStart(2, '0');
    const major = report.referenceYear;
    const patch = report.id;

    return {
      correlationId,
      versions: [`${major}.${month}.${patch}`],
    };
  }

  /**
   * Get resume statistics of reports
   */
  getResume(): ResumeReportsResponseDto {
    const reports = this.reportsRepository.findAll();
    const total = reports.length;

    const reportsToGenerate = reports.filter(
      (r) => r.status === ReportStatus.READY_TO_GENERATE,
    ).length;

    const reportsPendingCorrection = reports.filter(
      (r) =>
        r.status === ReportStatus.PENDING_INFORMATION ||
        r.status === ReportStatus.NEED_ANALYSIS,
    ).length;

    const reportsReadyToSend = reports.filter(
      (r) => r.status === ReportStatus.READY_TO_SEND,
    ).length;

    const reportsSent = reports.filter((r) => r.status === ReportStatus.SENT).length;

    const sentReportsPercentage = total > 0 ? parseFloat(((reportsSent / total) * 100).toFixed(1)) : 0;

    return {
      totalReports: total,
      sentReportsPercentage,
      reportsToGenerate,
      reportsPendingCorrection,
      reportsReadyToSend,
      reportsSent,
    };
  }

  /**
   * Get resume statistics of reports filtered by reference date
   */
  getDashboardResume(referenceDate?: string): ResumeReportsResponseDto {
    let reports = this.reportsRepository.findAll();

    // Filter by reference date if provided (contract format: YYYY-MM-DD)
    if (referenceDate) {
      const [year, month] = referenceDate.split('-');
      const referenceMonth = parseInt(month, 10);
      const referenceYear = parseInt(year, 10);

      reports = reports.filter(
        (r) =>
          r.referenceMonth === referenceMonth && r.referenceYear === referenceYear,
      );
    }

    const total = reports.length;

    const reportsToGenerate = reports.filter(
      (r) => r.status === ReportStatus.READY_TO_GENERATE,
    ).length;

    const reportsPendingCorrection = reports.filter(
      (r) =>
        r.status === ReportStatus.PENDING_INFORMATION ||
        r.status === ReportStatus.NEED_ANALYSIS,
    ).length;

    const reportsReadyToSend = reports.filter(
      (r) => r.status === ReportStatus.READY_TO_SEND,
    ).length;

    const reportsSent = reports.filter((r) => r.status === ReportStatus.SENT).length;

    const sentReportsPercentage = total > 0 ? parseFloat(((reportsSent / total) * 100).toFixed(1)) : 0;

    return {
      totalReports: total,
      sentReportsPercentage,
      reportsToGenerate,
      reportsPendingCorrection,
      reportsReadyToSend,
      reportsSent,
    };
  }

  /**
   * Get resume statistics of reports grouped by reference date
   */
  getResumeByReferenceDates(): ResumeReportsByDateResponseDto {
    const reports = this.reportsRepository.findAll();

    // Group reports by reference date
    const groupedByDate = new Map<string, Report[]>();

    reports.forEach((report) => {
      const month = String(report.referenceMonth).padStart(2, '0');
      const referenceDate = `${month}/${report.referenceYear}`;

      if (!groupedByDate.has(referenceDate)) {
        groupedByDate.set(referenceDate, []);
      }
      groupedByDate.get(referenceDate)!.push(report);
    });

    // Calculate statistics for each reference date
    const records: ResumeReportByDateDto[] = Array.from(groupedByDate.entries())
      .map(([referenceDate, reportsForDate]) => {
        const total = reportsForDate.length;

        const reportsToGenerate = reportsForDate.filter(
          (r) => r.status === ReportStatus.READY_TO_GENERATE,
        ).length;

        const reportsPendingCorrection = reportsForDate.filter(
          (r) =>
            r.status === ReportStatus.PENDING_INFORMATION ||
            r.status === ReportStatus.NEED_ANALYSIS,
        ).length;

        const reportsReadyToSend = reportsForDate.filter(
          (r) => r.status === ReportStatus.READY_TO_SEND,
        ).length;

        const reportsSent = reportsForDate.filter(
          (r) => r.status === ReportStatus.SENT,
        ).length;

        const sentReportsPercentage = total > 0 ? parseFloat(((reportsSent / total) * 100).toFixed(1)) : 0;

        return {
          referenceDate,
          sentReportsPercentage,
          reportsToGenerate,
          reportsPendingCorrection,
          reportsReadyToSend,
          reportsSent,
          totalReports: total,
        };
      })
      // Sort by reference date in descending order (most recent first)
      .sort((a, b) => {
        const [monthA, yearA] = a.referenceDate.split('/').map(Number);
        const [monthB, yearB] = b.referenceDate.split('/').map(Number);
        
        if (yearB !== yearA) return yearB - yearA;
        return monthB - monthA;
      });

    return { records };
  }

  /**
   * Apply filters to reports list
   */
  private applyFilters(reports: Report[], query: ReportsQueryDto): Report[] {
    let filtered = [...reports];
    const statuses = query.status ?? query['status[]'];
    const economicGroupsQuery =
      query.economicGroup ?? query['economicGroup[]'];

    // Filter by search (UC, meterPoint, or nickname)
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.uc.toLowerCase().includes(searchLower) ||
          report.meterPoint.toLowerCase().includes(searchLower) ||
          report.nickname.toLowerCase().includes(searchLower),
      );
    }

    // Filter by status (support both array format and CSV format)
    if (statuses && statuses.length > 0) {
      filtered = filtered.filter((report) => statuses.includes(report.status));
    }

    // Filter by reference date (YYYY-MM-DD format)
    if (query.startDate || query.endDate) {
      filtered = filtered.filter((report) => {
        const reportDate = this.toReferenceDate(report);

        if (query.startDate && reportDate < query.startDate) {
          return false;
        }

        if (query.endDate && reportDate > query.endDate) {
          return false;
        }

        return true;
      });
    }

    // Filter by economic group
    if (economicGroupsQuery && economicGroupsQuery.length > 0) {
      const economicGroups = economicGroupsQuery.map((group) =>
        group.toLowerCase(),
      );
      filtered = filtered.filter((report) =>
        economicGroups.some((group) =>
          report.economicGroup.toLowerCase().includes(group),
        ),
      );
    }

    return filtered;
  }

  /**
   * Apply sorting to reports list
   */
  private applySorting(
    reports: Report[],
    sortBy: SortBy = SortBy.REFERENCE_DATE,
    sortOrder: SortOrder = SortOrder.DESC,
  ): Report[] {
    const sorted = [...reports];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case SortBy.REFERENCE_DATE:
          const dateA = a.referenceYear * 100 + a.referenceMonth;
          const dateB = b.referenceYear * 100 + b.referenceMonth;
          comparison = dateA - dateB;
          break;
        case SortBy.CODE_UC:
          comparison = a.uc.localeCompare(b.uc);
          break;
        case SortBy.NICKNAME:
          comparison = a.nickname.localeCompare(b.nickname);
          break;
        case SortBy.ECONOMIC_GROUP:
          comparison = a.economicGroup.localeCompare(b.economicGroup);
          break;
        case SortBy.REPORT_STATUS:
          comparison = a.status.localeCompare(b.status);
          break;
        case SortBy.UPDATED_AT:
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        default:
          comparison = (a.referenceYear * 100 + a.referenceMonth) - (b.referenceYear * 100 + b.referenceMonth);
      }

      return sortOrder === SortOrder.ASC ? comparison : -comparison;
    });

    return sorted;
  }

  /**
   * Generate reports by IDs or all registers
   */
  generateReports(ids: string[]): { message: string; generatedCount: number } {
    // Check if requesting all registers
    if (ids.length === 1 && ids[0] === 'ALL_REGISTERS') {
      const allReports = this.reportsRepository.findAll();
      // Logic to generate all reports
      return {
        message: 'All reports generation initiated',
        generatedCount: allReports.length,
      };
    }

    // Generate specific reports by IDs
    const reports = this.reportsRepository.findAll();
    const numericIds = ids.map((id) => parseInt(id, 10));
    const foundReports = reports.filter((r) => numericIds.includes(r.id));

    return {
      message: `Reports generation initiated for ${foundReports.length} report(s)`,
      generatedCount: foundReports.length,
    };
  }

  /**
   * Send reports by IDs or all registers
   */
  sendReports(ids: string[]): { message: string; sentCount: number } {
    // Check if requesting all registers
    if (ids.length === 1 && ids[0] === 'ALL_REGISTERS') {
      const allReports = this.reportsRepository.findAll();
      // Logic to send all reports
      return {
        message: 'All reports sending initiated',
        sentCount: allReports.length,
      };
    }

    // Send specific reports by IDs
    const reports = this.reportsRepository.findAll();
    const numericIds = ids.map((id) => parseInt(id, 10));
    const foundReports = reports.filter((r) => numericIds.includes(r.id));

    return {
      message: `Reports sending initiated for ${foundReports.length} report(s)`,
      sentCount: foundReports.length,
    };
  }

  /**
   * Download reports by IDs or all registers
   */
  downloadReports(ids: string[]): { message: string; downloadCount: number } {
    // Check if requesting all registers
    if (ids.length === 1 && ids[0] === 'ALL_REGISTERS') {
      const allReports = this.reportsRepository.findAll();
      // Logic to download all reports
      return {
        message: 'All reports download initiated',
        downloadCount: allReports.length,
      };
    }

    // Download specific reports by IDs
    const reports = this.reportsRepository.findAll();
    const numericIds = ids.map((id) => parseInt(id, 10));
    const foundReports = reports.filter((r) => numericIds.includes(r.id));

    return {
      message: `Reports download initiated for ${foundReports.length} report(s)`,
      downloadCount: foundReports.length,
    };
  }

  /**
   * Transform Report to API response shape
   */
  private toReportResponse(report: Report): ReportResponseDto {
    return {
      correlationId: this.toCorrelationId(report),
      codeUc: report.uc,
      nickname: report.nickname,
      referenceDate: this.toReferenceDate(report),
      economicGroup: report.economicGroup,
      reportStatus: report.status,
      message: this.toMessage(report.status),
      updatedAt: report.updatedAt.toISOString(),
      ingestedAt: report.createdAt.toISOString(),
      builtAt: report.status !== ReportStatus.READY_TO_GENERATE ? report.updatedAt.toISOString() : undefined,
      sentAt:
        report.status === ReportStatus.SENT || report.status === ReportStatus.QUEUED_FOR_SENDING
          ? report.updatedAt.toISOString()
          : undefined,
    };
  }

  private toReferenceDate(report: Report): string {
    return `${report.referenceYear}-${String(report.referenceMonth).padStart(2, '0')}-01`;
  }

  private toCorrelationId(report: Report): string {
    return this.reportsRepository.getCorrelationId(report);
  }

  private toMessage(status: ReportStatus): string {
    switch (status) {
      case ReportStatus.READY_TO_GENERATE:
        return 'Report ready to be generated';
      case ReportStatus.GENERATING_REPORT:
        return 'Report is being generated';
      case ReportStatus.PENDING_INFORMATION:
        return 'Report is pending information';
      case ReportStatus.NEED_ANALYSIS:
        return 'Report needs analysis';
      case ReportStatus.PROCESSING_ERROR:
        return 'An error occurred while processing the report';
      case ReportStatus.QUEUED_FOR_SENDING:
        return 'Report queued for sending';
      case ReportStatus.SENT:
        return 'Report sent successfully';
      case ReportStatus.SENDING_ERROR:
        return 'An error occurred while sending the report';
      case ReportStatus.READY_TO_SEND:
      default:
        return 'Report ready to be sent';
    }
  }
}
