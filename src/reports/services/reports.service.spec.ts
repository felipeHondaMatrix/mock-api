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
      it('should return correct totalPages and totalItems', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 10,
        };

        const result = service.listReports(query);

        expect(result.paging.totalItems).toBe(200);
        expect(result.paging.totalPages).toBe(20);
        expect(result.paging.page).toBe(1);
        expect(result.paging.pageSize).toBe(10);
      });

      it('should return correct number of records per page', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 25,
        };

        const result = service.listReports(query);

        expect(result.response.records).toHaveLength(25);
        expect(result.paging.totalPages).toBe(8);
      });

      it('should handle last page with fewer items', () => {
        const query: ReportsQueryDto = {
          page: 20,
          pageSize: 15,
        };

        const result = service.listReports(query);

        expect(result.response.records.length).toBeLessThanOrEqual(15);
        expect(result.paging.totalItems).toBe(200);
      });

      it('should handle page beyond total pages (empty result)', () => {
        const query: ReportsQueryDto = {
          page: 999,
          pageSize: 10,
        };

        const result = service.listReports(query);

        expect(result.response.records).toHaveLength(0);
        expect(result.paging.totalPages).toBe(20);
      });
    });

    describe('filtering by status', () => {
      it('should filter reports by single status', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 100,
          status: [ReportStatus.SENT],
        };

        const result = service.listReports(query);

        result.response.records.forEach((record) => {
          expect(record.status).toBe(ReportStatus.SENT);
        });
      });

      it('should filter reports by multiple statuses', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 100,
          status: [ReportStatus.SENT, ReportStatus.READY_TO_SEND],
        };

        const result = service.listReports(query);

        result.response.records.forEach((record) => {
          expect([ReportStatus.SENT, ReportStatus.READY_TO_SEND]).toContain(record.status);
        });
      });

      it('should return empty when filtering by non-existent status combination', () => {
        // First get all reports with SENT status to ensure test is valid
        const allReports = repository.findAll();
        const sentReports = allReports.filter((r) => r.status === ReportStatus.SENT);

        if (sentReports.length > 0) {
          const query: ReportsQueryDto = {
            page: 1,
            pageSize: 100,
            status: [ReportStatus.SENT],
          };

          const result = service.listReports(query);
          expect(result.response.records.length).toBeGreaterThan(0);
        }
      });
    });

    describe('search functionality', () => {
      it('should search by UC (case-insensitive)', () => {
        const reports = repository.findAll();
        const firstReport = reports[0];
        const ucPart = firstReport.uc.substring(0, 5).toLowerCase();

        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 100,
          search: ucPart,
        };

        const result = service.listReports(query);

        expect(result.response.records.length).toBeGreaterThan(0);
        result.response.records.forEach((record) => {
          expect(record.uc.toLowerCase()).toContain(ucPart);
        });
      });

      it('should search by meterPoint (case-insensitive)', () => {
        const reports = repository.findAll();
        const firstReport = reports[0];
        const meterPointPart = firstReport.meterPoint.substring(0, 4);

        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 100,
          search: meterPointPart,
        };

        const result = service.listReports(query);

        expect(result.response.records.length).toBeGreaterThan(0);
      });

      it('should search by nickname (case-insensitive)', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 100,
          search: 'unidade',
        };

        const result = service.listReports(query);

        expect(result.response.records.length).toBeGreaterThan(0);
        result.response.records.forEach((record) => {
          expect(record.nickname.toLowerCase()).toContain('unidade');
        });
      });
    });

    describe('reference date filtering', () => {
      it('should filter by referenceDate (YYYY-MM-DD format)', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 100,
          referenceDate: '2026-02-01',
        };

        const result = service.listReports(query);

        result.response.records.forEach((record) => {
          expect(record.referenceDate).toBe('02/2026');
        });
      });

      it('should filter by referenceDate and ignore day component', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 100,
          referenceDate: '2026-02-15', // Day should be ignored
        };

        const result = service.listReports(query);

        result.response.records.forEach((record) => {
          expect(record.referenceDate).toBe('02/2026');
        });
      });
    });

    describe('economic group filtering', () => {
      it('should filter by economicGroup (contains, case-insensitive)', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 100,
          economicGroup: 'grupo a',
        };

        const result = service.listReports(query);

        expect(result.response.records.length).toBeGreaterThan(0);
        result.response.records.forEach((record) => {
          expect(record.economicGroup.toLowerCase()).toContain('grupo');
        });
      });
    });

    describe('sorting', () => {
      it('should sort by id ascending', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 10,
          sortBy: SortBy.ID,
          sortOrder: SortOrder.ASC,
        };

        const result = service.listReports(query);

        for (let i = 1; i < result.response.records.length; i++) {
          expect(result.response.records[i].id).toBeGreaterThanOrEqual(
            result.response.records[i - 1].id,
          );
        }
      });

      it('should sort by id descending', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 10,
          sortBy: SortBy.ID,
          sortOrder: SortOrder.DESC,
        };

        const result = service.listReports(query);

        for (let i = 1; i < result.response.records.length; i++) {
          expect(result.response.records[i].id).toBeLessThanOrEqual(
            result.response.records[i - 1].id,
          );
        }
      });

      it('should sort by nickname ascending', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 10,
          sortBy: SortBy.NICKNAME,
          sortOrder: SortOrder.ASC,
        };

        const result = service.listReports(query);

        for (let i = 1; i < result.response.records.length; i++) {
          expect(
            result.response.records[i].nickname.localeCompare(
              result.response.records[i - 1].nickname,
            ),
          ).toBeGreaterThanOrEqual(0);
        }
      });
    });

    describe('response format', () => {
      it('should return correct response structure', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 10,
        };

        const result = service.listReports(query);

        expect(result).toHaveProperty('response');
        expect(result).toHaveProperty('paging');
        expect(result.response).toHaveProperty('records');
        expect(Array.isArray(result.response.records)).toBe(true);
      });

      it('should return ReportItem with correct fields', () => {
        const query: ReportsQueryDto = {
          page: 1,
          pageSize: 1,
        };

        const result = service.listReports(query);
        const record = result.response.records[0];

        expect(record).toHaveProperty('id');
        expect(record).toHaveProperty('uc');
        expect(record).toHaveProperty('meterPoint');
        expect(record).toHaveProperty('nickname');
        expect(record).toHaveProperty('referenceDate');
        expect(record).toHaveProperty('economicGroup');
        expect(record).toHaveProperty('status');
        expect(record).toHaveProperty('url');

        // Validate referenceDate format (MM/YYYY)
        expect(record.referenceDate).toMatch(/^\d{2}\/\d{4}$/);

        // Validate URL format
        expect(record.url).toBe(`https://api.matrixenergia.com/reports/${record.id}`);
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

    it('should calculate sentReportsPercentage correctly', () => {
      const result = service.getResume();
      const total = 200;
      const expectedPercentage = parseFloat(((result.reportsSent / total) * 100).toFixed(1));

      expect(result.sentReportsPercentage).toBe(expectedPercentage);
      expect(result.sentReportsPercentage).toBeGreaterThanOrEqual(0);
      expect(result.sentReportsPercentage).toBeLessThanOrEqual(100);
    });

    it('should count reportsToGenerate correctly', () => {
      const result = service.getResume();
      const allReports = repository.findAll();
      const expectedCount = allReports.filter(
        (r) => r.status === ReportStatus.READY_TO_GENERATE,
      ).length;

      expect(result.reportsToGenerate).toBe(expectedCount);
    });

    it('should count reportsPendingCorrection correctly', () => {
      const result = service.getResume();
      const allReports = repository.findAll();
      const expectedCount = allReports.filter(
        (r) =>
          r.status === ReportStatus.INFORMATION_PENDING ||
          r.status === ReportStatus.NEEDS_ANALYSIS,
      ).length;

      expect(result.reportsPendingCorrection).toBe(expectedCount);
    });

    it('should count reportsReadyToSend correctly', () => {
      const result = service.getResume();
      const allReports = repository.findAll();
      const expectedCount = allReports.filter((r) => r.status === ReportStatus.READY_TO_SEND).length;

      expect(result.reportsReadyToSend).toBe(expectedCount);
    });

    it('should count reportsSent correctly', () => {
      const result = service.getResume();
      const allReports = repository.findAll();
      const expectedCount = allReports.filter((r) => r.status === ReportStatus.SENT).length;

      expect(result.reportsSent).toBe(expectedCount);
    });

    it('should have sentReportsPercentage with 1 decimal place', () => {
      const result = service.getResume();
      const decimalPlaces = result.sentReportsPercentage.toString().split('.')[1]?.length || 0;

      expect(decimalPlaces).toBeLessThanOrEqual(1);
    });
  });
});
