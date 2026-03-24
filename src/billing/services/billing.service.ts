import { Injectable } from '@nestjs/common';
import { ReportsRepository } from '../../reports/repositories/reports.repository';
import { ReportStatus } from '../../common/enums/report-status.enum';
import type { BillingStatusResponseDto } from '../../generated/epr-flow-control-api/model';

@Injectable()
export class BillingService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  currentStatus(): BillingStatusResponseDto {
    const reports = this.reportsRepository.findAll();
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const isBillingRunning = reports.some(
      (report) =>
        report.status === ReportStatus.GENERATING_REPORT &&
        report.referenceMonth === currentMonth &&
        report.referenceYear === currentYear,
    );

    return { isBillingRunning };
  }
}
