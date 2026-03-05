import { Injectable } from '@nestjs/common';
import { ReportsRepository } from '../repositories/reports.repository';
import { ReportsQueryDto, SortBy, SortOrder } from '../dto/reports-query.dto';
import { Report } from '@/common/interfaces/report.interface';
import { ReportStatus } from '@/common/enums/report-status.enum';
import { ResumeReportsResponseDto } from '../dto/resume-reports-response.dto';
import { ResumeReportByDateDto, ResumeReportsByDateResponseDto } from '../dto/resume-reports-by-date.dto';
import { ReportsListResponseDto } from '../dto/reports-response.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  /**
   * Get paginated and filtered list of reports
   */
  listReports(query: ReportsQueryDto): ReportsListResponseDto {
    let reports = this.reportsRepository.findAll();

    // Apply filters
    reports = this.applyFilters(reports, query);

    // Apply sorting
    reports = this.applySorting(reports, query.sortBy, query.sortOrder);

    // Calculate pagination
    const totalElements = reports.length;
    const totalPages = Math.ceil(totalElements / query.pageSize);
    const startIndex = query.page * query.pageSize;
    const endIndex = startIndex + query.pageSize;

    // Get paginated records
    const paginatedReports = reports.slice(startIndex, endIndex);

    return {
      response: paginatedReports,
      paging: {
        page: query.page,
        elementsPerPage: query.pageSize,
        totalPages,
        totalElements,
      },
    };
  }

  /**
   * Get resume statistics of reports
   */
  getResume(): ResumeReportsResponseDto {
    const reports = this.reportsRepository.findAll();
    const total = reports.length;

    const reportsToGenerate = reports.filter(
      (r) => r.reportStatus === ReportStatus.READY_TO_GENERATE,
    ).length;

    const reportsPendingCorrection = reports.filter(
      (r) =>
        r.reportStatus === ReportStatus.PENDING_INFORMATION ||
        r.reportStatus === ReportStatus.NEED_ANALYSIS,
    ).length;

    const reportsReadyToSend = reports.filter(
      (r) => r.reportStatus === ReportStatus.READY_TO_SEND,
    ).length;

    const reportsSent = reports.filter(
      (r) => r.reportStatus === ReportStatus.SENT,
    ).length;
    const sentReportsPercentage =
      total > 0
        ? parseFloat(((reportsSent / total) * 100).toFixed(1))
        : 0;

    return {
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

    // Filter by reference date if provided (format: MM/YYYY -> convert to YYYY-MM prefix)
    if (referenceDate) {
      const [month, year] = referenceDate.split('/');
      const prefix = `${year}-${month}`;
      reports = reports.filter((r) => r.referenceDate.startsWith(prefix));
    }

    const total = reports.length;

    const reportsToGenerate = reports.filter(
      (r) => r.reportStatus === ReportStatus.READY_TO_GENERATE,
    ).length;

    const reportsPendingCorrection = reports.filter(
      (r) =>
        r.reportStatus === ReportStatus.PENDING_INFORMATION ||
        r.reportStatus === ReportStatus.NEED_ANALYSIS,
    ).length;

    const reportsReadyToSend = reports.filter(
      (r) => r.reportStatus === ReportStatus.READY_TO_SEND,
    ).length;

    const reportsSent = reports.filter(
      (r) => r.reportStatus === ReportStatus.SENT,
    ).length;
    const sentReportsPercentage =
      total > 0
        ? parseFloat(((reportsSent / total) * 100).toFixed(1))
        : 0;

    return {
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

    // Group reports by reference date (year-month prefix)
    const groupedByDate = new Map<string, Report[]>();

    reports.forEach((report) => {
      const [year, month] = report.referenceDate.split('-');
      const key = `${month}/${year}`;

      if (!groupedByDate.has(key)) {
        groupedByDate.set(key, []);
      }
      groupedByDate.get(key)!.push(report);
    });

    // Calculate statistics for each reference date
    const records: ResumeReportByDateDto[] = Array.from(groupedByDate.entries())
      .map(([referenceDate, reportsForDate]) => {
        const total = reportsForDate.length;

        const reportsToGenerate = reportsForDate.filter(
          (r) => r.reportStatus === ReportStatus.READY_TO_GENERATE,
        ).length;

        const reportsPendingCorrection = reportsForDate.filter(
          (r) =>
            r.reportStatus === ReportStatus.PENDING_INFORMATION ||
            r.reportStatus === ReportStatus.NEED_ANALYSIS,
        ).length;

        const reportsReadyToSend = reportsForDate.filter(
          (r) => r.reportStatus === ReportStatus.READY_TO_SEND,
        ).length;

        const reportsSent = reportsForDate.filter(
          (r) => r.reportStatus === ReportStatus.SENT,
        ).length;
        const sentReportsPercentage =
          total > 0
            ? parseFloat(((reportsSent / total) * 100).toFixed(1))
            : 0;

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

    // Filter by search (codeUc or nickname)
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.codeUc.toLowerCase().includes(searchLower) ||
          report.nickname.toLowerCase().includes(searchLower),
      );
    }

    // Filter by status (support both array format and CSV format)
    if (query.status && query.status.length > 0) {
      // Handle both array ['STATUS1', 'STATUS2'] and comma-separated 'STATUS1,STATUS2'
      const statusArray = Array.isArray(query.status)
        ? query.status.flatMap((s) => (typeof s === 'string' && s.includes(',') ? s.split(',') : s))
        : [query.status];

      filtered = filtered.filter((report) =>
        statusArray.includes(report.reportStatus),
      );
    }

    // Filter by reference date (YYYY-MM-DD format, only year and month used)
    if (query.referenceDate) {
      const [year, month] = query.referenceDate.split('-');
      const prefix = `${year}-${month}`;
      filtered = filtered.filter((report) =>
        report.referenceDate.startsWith(prefix),
      );
    }

    // Filter by economic group
    if (query.economicGroup) {
      const groupLower = query.economicGroup.toLowerCase();
      filtered = filtered.filter((report) =>
        report.economicGroup.toLowerCase().includes(groupLower),
      );
    }

    return filtered;
  }

  /**
   * Apply sorting to reports list
   */
  private applySorting(reports: Report[], sortBy: SortBy, sortOrder: SortOrder): Report[] {
    const sorted = [...reports];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case SortBy.CORRELATION_ID:
          comparison = a.correlationId.localeCompare(b.correlationId);
          break;
        case SortBy.REFERENCE_DATE:
          comparison = a.referenceDate.localeCompare(b.referenceDate);
          break;
        case SortBy.NICKNAME:
          comparison = a.nickname.localeCompare(b.nickname);
          break;
        case SortBy.REPORT_STATUS:
          comparison = a.reportStatus.localeCompare(b.reportStatus);
          break;
        default:
          comparison = a.correlationId.localeCompare(b.correlationId);
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
      return {
        message: 'All reports generation initiated',
        generatedCount: allReports.length,
      };
    }

    // Generate specific reports by correlationId
    const reports = this.reportsRepository.findAll();
    const foundReports = reports.filter((r) => ids.includes(r.correlationId));

    return {
      message: `Reports generation initiated for ${foundReports.length} report(s)`,
      generatedCount: foundReports.length,
    };
  }

  /**
   * Send reports by correlationIds or all registers
   */
  sendReports(ids: string[]): { message: string; sentCount: number } {
    // Check if requesting all registers
    if (ids.length === 1 && ids[0] === 'ALL_REGISTERS') {
      const allReports = this.reportsRepository.findAll();
      return {
        message: 'All reports sending initiated',
        sentCount: allReports.length,
      };
    }

    // Send specific reports by correlationId
    const reports = this.reportsRepository.findAll();
    const foundReports = reports.filter((r) => ids.includes(r.correlationId));

    return {
      message: `Reports sending initiated for ${foundReports.length} report(s)`,
      sentCount: foundReports.length,
    };
  }

  /**
   * Download reports by correlationIds or all registers
   */
  downloadReports(ids: string[]): { message: string; downloadCount: number } {
    // Check if requesting all registers
    if (ids.length === 1 && ids[0] === 'ALL_REGISTERS') {
      const allReports = this.reportsRepository.findAll();
      return {
        message: 'All reports download initiated',
        downloadCount: allReports.length,
      };
    }

    // Download specific reports by correlationId
    const reports = this.reportsRepository.findAll();
    const foundReports = reports.filter((r) => ids.includes(r.correlationId));

    return {
      message: `Reports download initiated for ${foundReports.length} report(s)`,
      downloadCount: foundReports.length,
    };
  }
}
