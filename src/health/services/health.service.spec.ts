import { Test, TestingModule } from '@nestjs/testing';
import { ReportsRepository } from '../../reports/repositories/reports.repository';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;
  let repository: ReportsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService, ReportsRepository],
    }).compile();

    service = module.get<HealthService>(HealthService);
    repository = module.get<ReportsRepository>(ReportsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('checkBilling returns the expected structure', () => {
    const result = service.checkBilling();

    expect(result).toHaveProperty('isBillingRunning');
    expect(result).toHaveProperty('currentReferenceDate');
    expect(result).toHaveProperty('lastBillingEventAt');
    expect(result).toHaveProperty('message');
    expect(result.currentReferenceDate).toMatch(/^\d{2}\/\d{4}$/);
    expect(result.lastBillingEventAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('checkGenerationReports matches repository counts', () => {
    const result = service.checkGenerationReports();
    const allReports = repository.findAll();

    expect(result.generatingCount).toBe(
      allReports.filter((report) => report.status === 'GENERATING_REPORT').length,
    );
    expect(result.queuedToGenerate).toBe(
      allReports.filter((report) => report.status === 'READY_TO_GENERATE').length,
    );
    expect(result.currentReferenceDate).toMatch(/^\d{2}\/\d{4}$/);
  });
});
