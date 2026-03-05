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

  constructor() {
    this.reports = this.generateMockReports(200);
  }

  findAll(): Report[] {
    return this.reports;
  }

  count(): number {
    return this.reports.length;
  }

  /**
   * Generate mock reports for testing
   */
  private generateMockReports(count: number): Report[] {
    const reports: Report[] = [];
    const economicGroups = ['Matrix', 'Newave', 'Omega', 'Solaris', 'Vortex'];

    const plantPrefixes = [
      'Usina',
      'Eolica',
      'Solar',
      'Hidreletrica',
      'Termeletrica',
    ];
    const plantLocations = [
      'Iguatu',
      'Fortaleza',
      'Recife',
      'Parnaiba',
      'Caucaia',
      'Crato',
      'Salvador',
      'Ilheus',
      'Teresina',
      'Paulista',
      'Campina',
      'Mosso',
      'Sobral',
      'Juazeiro',
      'Petrolina',
    ];

    const statuses = Object.values(ReportStatus);
    const statusWeights: Record<ReportStatus, number> = {
      [ReportStatus.READY_TO_GENERATE]: 0.12,
      [ReportStatus.GENERATING_REPORT]: 0.05,
      [ReportStatus.PENDING_INFORMATION]: 0.05,
      [ReportStatus.NEED_ANALYSIS]: 0.04,
      [ReportStatus.PROCESSING_ERROR]: 0.02,
      [ReportStatus.READY_TO_SEND]: 0.35,
      [ReportStatus.QUEUED_FOR_SENDING]: 0.18,
      [ReportStatus.SENT]: 0.14,
      [ReportStatus.SENDING_ERROR]: 0.05,
    };

    const isoTimestamp = '2026-03-05T08:10:40.773Z';

    for (let i = 1; i <= count; i++) {
      // Generate reference date (last 12 months)
      const monthsAgo = Math.floor(Math.random() * 12);
      const date = new Date(2026, 2, 1); // base: Mar 2026
      date.setMonth(date.getMonth() - monthsAgo);
      const refYear = date.getFullYear();
      const refMonth = String(date.getMonth() + 1).padStart(2, '0');
      const referenceDate = `${refYear}-${refMonth}-01`;

      const reportStatus = this.getWeightedRandomStatus(statusWeights);

      const prefix = plantPrefixes[i % plantPrefixes.length];
      const location = plantLocations[i % plantLocations.length];

      reports.push({
        correlationId: this.generateUUID(i),
        codeUc: this.generateCodeUc(i),
        nickname: `${prefix} ${location}`,
        referenceDate,
        economicGroup: economicGroups[i % economicGroups.length],
        reportStatus,
        updatedAt: isoTimestamp,
        ingestedAt: isoTimestamp,
        builtAt: isoTimestamp,
        sentAt: isoTimestamp,
      });
    }

    return reports;
  }

  private getWeightedRandomStatus(
    weights: Record<ReportStatus, number>,
  ): ReportStatus {
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

  private generateUUID(seed: number): string {
    // Deterministic UUID-like string based on seed for reproducibility
    const hex = (n: number, len: number) =>
      n.toString(16).padStart(len, '0').slice(-len);
    const s = seed * 9301 + 49297;
    return [
      hex(s ^ 0xdeadbeef, 8),
      hex(s ^ 0xcafe0000, 4),
      '4' + hex(s ^ 0xf00d, 3),
      hex((s ^ 0xbeef) | 0x8000, 4),
      hex(s ^ 0xabcdef12, 12),
    ].join('-');
  }

  private generateCodeUc(id: number): string {
    return String(id * 1111111111 % 9000000000 + 1000000000).slice(0, 10);
  }
}
