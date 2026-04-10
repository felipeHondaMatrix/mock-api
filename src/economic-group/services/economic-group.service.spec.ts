import { Test, TestingModule } from '@nestjs/testing';
import { ReportsRepository } from '../../reports/repositories/reports.repository';
import { EconomicGroupService } from './economic-group.service';

describe('EconomicGroupService', () => {
  let service: EconomicGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EconomicGroupService, ReportsRepository],
    }).compile();

    service = module.get<EconomicGroupService>(EconomicGroupService);
  });

  it('returns the orval economic group contract shape', () => {
    const result = service.list();

    expect(result).toEqual({
      economicGroups: expect.any(Array),
    });
  });

  it('returns unique economic groups sorted alphabetically', () => {
    const result = service.list();

    expect(result.economicGroups).toEqual([
      'Grupo Econômico A',
      'Grupo Econômico B',
      'Grupo Econômico C',
      'Grupo Econômico D',
      'Grupo Econômico E',
    ]);
  });
});
