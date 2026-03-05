import { Injectable } from '@nestjs/common';
import { ReportsRepository } from '@/reports/repositories/reports.repository';
import { ReportStatus } from '@/common/enums/report-status.enum';
import { CheckBillingResponseDto } from '@/health/dto/check-billing-response.dto';
import { CheckGenerationReportsResponseDto } from '@/health/dto/check-generation-reports-response.dto';

@Injectable()
export class HealthService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  /**
   * Check billing process status
   */
  checkBilling(): CheckBillingResponseDto {
    const reports = this.reportsRepository.findAll();
    const now = new Date();

    // Get current month/year
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentReferenceDate = `${String(currentMonth).padStart(2, '0')}/${currentYear}`;

    const currentYearMonthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    // Check if there are reports being generated in current month
    const generatingInCurrentMonth = reports.filter(
      (r) =>
        r.reportStatus === ReportStatus.GENERATING_REPORT &&
        r.referenceDate.startsWith(currentYearMonthPrefix),
    );

    const isBillingRunning = generatingInCurrentMonth.length > 0;

    // Mock last billing event (10 minutes ago)
    const lastBillingEventAt = new Date(now.getTime() - 10 * 60 * 1000).toISOString();

    const message = isBillingRunning
      ? 'Billing process is active with reports being generated'
      : 'No billing process currently running';

    return {
      isBillingRunning,
      currentReferenceDate,
      lastBillingEventAt,
      message,
    };
  }

  /**
   * Check report generation status
   */
  checkGenerationReports(): CheckGenerationReportsResponseDto {
    const reports = this.reportsRepository.findAll();
    const now = new Date();

    // Get current month/year
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentReferenceDate = `${String(currentMonth).padStart(2, '0')}/${currentYear}`;

    // Count reports being generated
    const generatingCount = reports.filter(
      (r) => r.reportStatus === ReportStatus.GENERATING_REPORT,
    ).length;

    // Count reports queued to generate
    const queuedToGenerate = reports.filter(
      (r) => r.reportStatus === ReportStatus.READY_TO_GENERATE,
    ).length;

    const isGeneratingReports = generatingCount > 0;

    return {
      isGeneratingReports,
      generatingCount,
      queuedToGenerate,
      currentReferenceDate,
    };
  }
}
