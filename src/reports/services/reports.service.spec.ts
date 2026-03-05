import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { ReportsRepository } from '../repositories/reports.repository';
import { ReportsQueryDto, SortBy, SortOrder } from '../dto/reports-query.dto';
import { ReportStatus } from '@/common/enums/report-status.enum';

describe('ReportsService', () => {
  let service: ReportsService;
  let repository: ReportsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsService, ReportsRepository],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repository = module.get<ReportsRepository>(ReportsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listReports', () => {
    describe('pagination', () => {
      it('should return correct totalPages and totalElements', () => {
        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 10,
        };

        const result = service.listReports(query);

        expect(result.paging.totalElements).toBe(200);
        expect(result.paging.totalPages).toBe(20);
        expect(result.paging.page).toBe(0);
        expect(result.paging.elementsPerPage).toBe(10);
      });

      it('should return correct number of records per page', () => {
        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 25,
        };

        const result = service.listReports(query);

        expect(result.response).toHaveLength(25);
        expect(result.paging.totalPages).toBe(8);
      });

      it('should handle last page with fewer items', () => {
        // 200 items, pageSize 15 → totalPages = 14 (pages 0-13), last page has 5 items
        const query: ReportsQueryDto = {
          page: 13,
          pageSize: 15,
        };

        const result = service.listReports(query);

        expect(result.response.length).toBeLessThanOrEqual(15);
        expect(result.paging.totalElements).toBe(200);
      });

      it('should handle page beyond total pages (empty result)', () => {
        const query: ReportsQueryDto = {
          page: 999,
          pageSize: 10,
        };

        const result = service.listReports(query);

        expect(result.response).toHaveLength(0);
        expect(result.paging.totalPages).toBe(20);
      });
    });

    describe('filtering by reportStatus', () => {
      it('should filter reports by single reportStatus', () => {
        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 100,
          status: [ReportStatus.READY_TO_SEND],
        };

        const result = service.listReports(query);

        result.response.forEach((record) => {
          expect(record.reportStatus).toBe(ReportStatus.READY_TO_SEND);
        });
      });

      it('should filter reports by multiple statuses', () => {
        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 100,
          status: [ReportStatus.QUEUED_FOR_SENDING, ReportStatus.READY_TO_SEND],
        };

        const result = service.listReports(query);

        result.response.forEach((record) => {
          expect([
            ReportStatus.QUEUED_FOR_SENDING,
            ReportStatus.READY_TO_SEND,
          ]).toContain(record.reportStatus);
        });
      });

      it('should return results when filtering by READY_TO_GENERATE', () => {
        const allReports = repository.findAll();
        const eligible = allReports.filter(
          (r) => r.reportStatus === ReportStatus.READY_TO_GENERATE,
        );

        if (eligible.length > 0) {
          const query: ReportsQueryDto = {
            page: 0,
            pageSize: 100,
            status: [ReportStatus.READY_TO_GENERATE],
          };

          const result = service.listReports(query);
          expect(result.response.length).toBeGreaterThan(0);
        }
      });
    });

    describe('search functionality', () => {
      it('should search by codeUc (case-insensitive)', () => {
        const reports = repository.findAll();
        const firstReport = reports[0];
        const part = firstReport.codeUc.substring(0, 5).toLowerCase();

        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 100,
          search: part,
        };

        const result = service.listReports(query);

        expect(result.response.length).toBeGreaterThan(0);
        result.response.forEach((record) => {
          expect(record.codeUc.toLowerCase()).toContain(part);
        });
      });

      it('should search by nickname (case-insensitive)', () => {
        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 100,
          search: 'usina',
        };

        const result = service.listReports(query);

        expect(result.response.length).toBeGreaterThan(0);
        result.response.forEach((record) => {
          expect(record.nickname.toLowerCase()).toContain('usina');
        });
      });
    });

    describe('reference date filtering', () => {
      it('should filter by referenceDate (YYYY-MM-DD format)', () => {
        const allReports = repository.findAll();
        const targetPrefix = '2026-02';
        const hasMatches = allReports.some((r) =>
          r.referenceDate.startsWith(targetPrefix),
        );

        if (hasMatches) {
          const query: ReportsQueryDto = {
            page: 0,
            pageSize: 100,
            referenceDate: '2026-02-01',
          };

          const result = service.listReports(query);

          result.response.forEach((record) => {
            expect(record.referenceDate.startsWith('2026-02')).toBe(true);
          });
        }
      });

      it('should filter by referenceDate ignoring the day component', () => {
        const allReports = repository.findAll();
        const targetPrefix = '2026-02';
        const hasMatches = allReports.some((r) =>
          r.referenceDate.startsWith(targetPrefix),
        );

        if (hasMatches) {
          const query: ReportsQueryDto = {
            page: 0,
            pageSize: 100,
            referenceDate: '2026-02-15', // Day should be ignored
          };

          const result = service.listReports(query);

          result.response.forEach((record) => {
            expect(record.referenceDate.startsWith('2026-02')).toBe(true);
          });
        }
      });
    });

    describe('economic group filtering', () => {
      it('should filter by economicGroup (contains, case-insensitive)', () => {
        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 100,
          economicGroup: 'matrix',
        };

        const result = service.listReports(query);

        expect(result.response.length).toBeGreaterThan(0);
        result.response.forEach((record) => {
          expect(record.economicGroup.toLowerCase()).toContain('matrix');
        });
      });
    });

    describe('sorting', () => {
      it('should sort by correlationId ascending', () => {
        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 10,
          sortBy: SortBy.CORRELATION_ID,
          sortOrder: SortOrder.ASC,
        };

        const result = service.listReports(query);

        for (let i = 1; i < result.response.length; i++) {
          expect(
            result.response[i].correlationId.localeCompare(
              result.response[i - 1].correlationId,
            ),
          ).toBeGreaterThanOrEqual(0);
        }
      });

      it('should sort by correlationId descending', () => {
        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 10,
          sortBy: SortBy.CORRELATION_ID,
          sortOrder: SortOrder.DESC,
        };

        const result = service.listReports(query);

        for (let i = 1; i < result.response.length; i++) {
          expect(
            result.response[i].correlationId.localeCompare(
              result.response[i - 1].correlationId,
            ),
          ).toBeLessThanOrEqual(0);
        }
      });

      it('should sort by nickname ascending', () => {
        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 10,
          sortBy: SortBy.NICKNAME,
          sortOrder: SortOrder.ASC,
        };

        const result = service.listReports(query);

        for (let i = 1; i < result.response.length; i++) {
          expect(
            result.response[i].nickname.localeCompare(
              result.response[i - 1].nickname,
            ),
          ).toBeGreaterThanOrEqual(0);
        }
      });
    });

    describe('response format', () => {
      it('should return correct response structure', () => {
        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 10,
        };

        const result = service.listReports(query);

        expect(result).toHaveProperty('response');
        expect(result).toHaveProperty('paging');
        expect(Array.isArray(result.response)).toBe(true);
      });

      it('should return report items with correct fields matching new contract', () => {
        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 1,
        };

        const result = service.listReports(query);
        const record = result.response[0];

        expect(record).toHaveProperty('correlationId');
        expect(record).toHaveProperty('codeUc');
        expect(record).toHaveProperty('nickname');
        expect(record).toHaveProperty('referenceDate');
        expect(record).toHaveProperty('economicGroup');
        expect(record).toHaveProperty('reportStatus');
        expect(record).toHaveProperty('updatedAt');
        expect(record).toHaveProperty('ingestedAt');
        expect(record).toHaveProperty('builtAt');
        expect(record).toHaveProperty('sentAt');

        // Validate referenceDate format (YYYY-MM-DD)
        expect(record.referenceDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

        // Validate codeUc is a 10-digit string
        expect(record.codeUc).toMatch(/^\d{10}$/);
      });

      it('should NOT have old fields (id, uc, meterPoint, status, url)', () => {
        const query: ReportsQueryDto = {
          page: 0,
          pageSize: 1,
        };

        const result = service.listReports(query);
        const record = result.response[0] as any;

        expect(record.id).toBeUndefined();
        expect(record.uc).toBeUndefined();
        expect(record.meterPoint).toBeUndefined();
        expect(record.status).toBeUndefined();
        expect(record.url).toBeUndefined();
      });
    });
  });

  describe('getResume', () => {
    it('should return correct structure', () => {
      const result = service.getResume();

      expect(result).toHaveProperty('sentReportsPercentage');
      expect(result).toHaveProperty('reportsToGenerate');
      expect(result).toHaveProperty('reportsPendingCorrection');
      expect(result).toHaveProperty('reportsReadyToSend');
      expect(result).toHaveProperty('reportsSent');
    });

    it('should count reportsToGenerate correctly', () => {
      const result = service.getResume();
      const allReports = repository.findAll();
      const expectedCount = allReports.filter(
        (r) => r.reportStatus === ReportStatus.READY_TO_GENERATE,
      ).length;

      expect(result.reportsToGenerate).toBe(expectedCount);
    });

    it('should count reportsPendingCorrection correctly', () => {
      const result = service.getResume();
      const allReports = repository.findAll();
      const expectedCount = allReports.filter(
        (r) =>
          r.reportStatus === ReportStatus.PENDING_INFORMATION ||
          r.reportStatus === ReportStatus.NEED_ANALYSIS,
      ).length;

      expect(result.reportsPendingCorrection).toBe(expectedCount);
    });

    it('should count reportsReadyToSend correctly', () => {
      const result = service.getResume();
      const allReports = repository.findAll();
      const expectedCount = allReports.filter(
        (r) => r.reportStatus === ReportStatus.READY_TO_SEND,
      ).length;

      expect(result.reportsReadyToSend).toBe(expectedCount);
    });

    it('should count reportsSent correctly', () => {
      const result = service.getResume();
      const allReports = repository.findAll();
      const expectedCount = allReports.filter(
        (r) => r.reportStatus === ReportStatus.SENT,
      ).length;

      expect(result.reportsSent).toBe(expectedCount);
    });

    it('should calculate sentReportsPercentage correctly', () => {
      const result = service.getResume();
      const allReports = repository.findAll();
      const total = allReports.length;
      const sentCount = allReports.filter(
        (r) => r.reportStatus === ReportStatus.SENT,
      ).length;
      const expected = parseFloat(((sentCount / total) * 100).toFixed(1));

      expect(result.sentReportsPercentage).toBe(expected);
    });
  });
});
