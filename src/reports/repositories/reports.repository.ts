import { Injectable } from '@nestjs/common';
import { Report } from '@/common/interfaces/report.interface';
import { ReportStatus } from '@/common/enums/report-status.enum';

/**
 * In-Memory Reports Repository
 * 
 * This is a mock implementation using an in-memory array.
 * To migrate to a real database:
 * 1. Replace this class with a TypeORM/Prisma/Mongoose repository
 * 2. Update the methods to use actual database queries
 * 3. Keep the same interface/method signatures
 */
@Injectable()
export class ReportsRepository {
  private reports: Report[] = [];
  private readonly correlationIdPrefix = 'mock-correlation';
  private readonly priorityReadyToGenerateCount = 12;
  private readonly targetMarchSentCount = 16;

  constructor() {
    this.reports = this.generateMockReports(200);
  }

  findAll(): Report[] {
    return this.reports;
  }

  findById(id: number): Report | undefined {
    return this.reports.find((report) => report.id === id);
  }

  findByCorrelationId(correlationId: string): Report | undefined {
    const reportId = this.extractIdFromCorrelationId(correlationId);

    if (reportId === null) {
      return undefined;
    }

    return this.findById(reportId);
  }

  getCorrelationId(report: Pick<Report, 'id'>): string {
    return `${this.correlationIdPrefix}-${String(report.id).padStart(6, '0')}`;
  }

  count(): number {
    return this.reports.length;
  }

  private extractIdFromCorrelationId(correlationId: string): number | null {
    const escapedPrefix = this.correlationIdPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = correlationId.match(new RegExp(`^${escapedPrefix}-(\\d{6})$`));

    if (!match) {
      return null;
    }

    return Number.parseInt(match[1], 10);
  }

  /**
   * Generate mock reports for testing
   */
  private generateMockReports(count: number): Report[] {
    const reports: Report[] = [];
    const currentYear = new Date().getFullYear();
    const economicGroups = [
      'Grupo Econômico A',
      'Grupo Econômico B',
      'Grupo Econômico C',
      'Grupo Econômico D',
      'Grupo Econômico E',
    ];
    
    const statuses = Object.values(ReportStatus);
    const statusWeights = {
      [ReportStatus.READY_TO_GENERATE]: 0.15,
      [ReportStatus.GENERATING_REPORT]: 0.05,
      [ReportStatus.PENDING_INFORMATION]: 0.05,
      [ReportStatus.NEED_ANALYSIS]: 0.05,
      [ReportStatus.PROCESSING_ERROR]: 0.02,
      [ReportStatus.READY_TO_SEND]: 0.5,
      [ReportStatus.QUEUED_FOR_SENDING]: 0.13,
      [ReportStatus.SENT]: 0.04,
      [ReportStatus.SENDING_ERROR]: 0.01,
    };

    for (let i = 1; i <= count; i++) {
      // Generate reference date (last 12 months)
      const monthsAgo = Math.floor(Math.random() * 12);
      const date = new Date();
      date.setMonth(date.getMonth() - monthsAgo);
      const referenceMonth = date.getMonth() + 1;
      const referenceYear = date.getFullYear();

      // Keep several READY_TO_GENERATE records at the top of the default listing.
      const status =
        i > count - this.priorityReadyToGenerateCount
          ? ReportStatus.READY_TO_GENERATE
          : this.getWeightedRandomStatus(statusWeights);

      const report = {
        id: i,
        uc: this.generateUC(i),
        meterPoint: this.generateMeterPoint(i),
        nickname: this.generateNickname(i),
        referenceMonth,
        referenceYear,
        economicGroup: economicGroups[i % economicGroups.length],
        status,
        createdAt: new Date(date.getFullYear(), date.getMonth(), 1),
        updatedAt: new Date(),
      };

      reports.push(report);
    }

    this.ensureMarchSentReports(reports, currentYear);

    return reports;
  }

  private ensureMarchSentReports(reports: Report[], currentYear: number): void {
    const marchReports = reports.filter(
      (report) => report.referenceMonth === 3 && report.referenceYear === currentYear,
    );

    let sentCount = marchReports.filter(
      (report) => report.status === ReportStatus.SENT,
    ).length;

    for (const report of marchReports) {
      if (sentCount >= this.targetMarchSentCount) {
        break;
      }

      if (report.status === ReportStatus.SENT) {
        continue;
      }

      report.status = ReportStatus.SENT;
      sentCount++;
    }
  }

  private getWeightedRandomStatus(weights: Record<ReportStatus, number>): ReportStatus {
    const random = Math.random();
    let sum = 0;

    for (const [status, weight] of Object.entries(weights)) {
      sum += weight;
      if (random < sum) {
        return status as ReportStatus;
      }
    }

    return ReportStatus.READY_TO_SEND;
  }

  private generateUC(id: number): string {
    const regions = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO'];
    const region = regions[id % regions.length];
    const number = String(id).padStart(6, '0');
    return `UC-${region}-${number}`;
  }

  private generateMeterPoint(id: number): string {
    const prefix = String(id % 100).padStart(2, '0');
    const number = String(id).padStart(6, '0');
    return `MP-${prefix}${number}`;
  }

  private generateNickname(id: number): string {
    const prefixes = [
      'Unidade',
      'Filial',
      'Centro',
      'Loja',
      'Armazém',
      'Escritório',
      'Fábrica',
      'Depósito',
    ];
    const suffixes = [
      'Centro',
      'Norte',
      'Sul',
      'Leste',
      'Oeste',
      'Principal',
      'Matriz',
      'Shopping',
      'Industrial',
    ];

    const prefix = prefixes[id % prefixes.length];
    const suffix = suffixes[Math.floor(id / prefixes.length) % suffixes.length];
    const number = (id % 100) + 1;

    return `${prefix} ${suffix} ${number}`;
  }
}
