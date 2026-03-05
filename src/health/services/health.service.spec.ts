import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { ReportsRepository } from '../../reports/repositories/reports.repository';

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

  describe('checkBilling', () => {
    it('should return correct structure', () => {
      const result = service.checkBilling();

      expect(result).toHaveProperty('isBillingRunning');
      expect(result).toHaveProperty('currentReferenceDate');
      expect(result).toHaveProperty('lastBillingEventAt');
      expect(result).toHaveProperty('message');
    });

    it('should return currentReferenceDate in MM/YYYY format', () => {
      const result = service.checkBilling();

      expect(result.currentReferenceDate).toMatch(/^\d{2}\/\d{4}$/);
    });

    it('should return lastBillingEventAt as ISO date string', () => {
      const result = service.checkBilling();

      expect(() => new Date(result.lastBillingEventAt)).not.toThrow();
      expect(result.lastBillingEventAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should return boolean for isBillingRunning', () => {
      const result = service.checkBilling();

      expect(typeof result.isBillingRunning).toBe('boolean');
    });

    it('should return appropriate message based on billing status', () => {
      const result = service.checkBilling();

      expect(typeof result.message).toBe('string');
      expect(result.message.length).toBeGreaterThan(0);
    });
  });

  describe('checkGenerationReports', () => {
    it('should return correct structure', () => {
      const result = service.checkGenerationReports();

      expect(result).toHaveProperty('isGeneratingReports');
      expect(result).toHaveProperty('generatingCount');
      expect(result).toHaveProperty('queuedToGenerate');
      expect(result).toHaveProperty('currentReferenceDate');
    });

    it('should return currentReferenceDate in MM/YYYY format', () => {
      const result = service.checkGenerationReports();

      expect(result.currentReferenceDate).toMatch(/^\d{2}\/\d{4}$/);
    });

    it('should return correct generatingCount', () => {
      const result = service.checkGenerationReports();
      const allReports = repository.findAll();
      const expectedCount = allReports.filter((r) => r.reportStatus === 'GENERATING_REPORT').length;

      expect(result.generatingCount).toBe(expectedCount);
    });

    it('should return correct queuedToGenerate', () => {
      const result = service.checkGenerationReports();
      const allReports = repository.findAll();
      const expectedCount = allReports.filter((r) => r.reportStatus === 'READY_TO_GENERATE').length;

      expect(result.queuedToGenerate).toBe(expectedCount);
    });

    it('should set isGeneratingReports to true when generatingCount > 0', () => {
      const result = service.checkGenerationReports();

      if (result.generatingCount > 0) {
        expect(result.isGeneratingReports).toBe(true);
      } else {
        expect(result.isGeneratingReports).toBe(false);
      }
    });
  });
});
