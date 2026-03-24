import { Test, TestingModule } from '@nestjs/testing';
import { ReportsRepository } from '../../reports/repositories/reports.repository';
import { BillingService } from './billing.service';

describe('BillingService', () => {
  let service: BillingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingService, ReportsRepository],
    }).compile();

    service = module.get<BillingService>(BillingService);
  });

  it('returns the orval billing contract shape', () => {
    const result = service.currentStatus();

    expect(result).toEqual({
      isBillingRunning: expect.any(Boolean),
    });
  });
});
