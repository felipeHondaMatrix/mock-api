import { Injectable } from '@nestjs/common';
import { ReportsRepository } from '../../reports/repositories/reports.repository';
import type { EconomicGroupOptionsResponseDto } from '../../generated/epr-flow-control-api/model';

@Injectable()
export class EconomicGroupService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  list(): EconomicGroupOptionsResponseDto {
    const economicGroups = Array.from(
      new Set(this.reportsRepository.findAll().map((report) => report.economicGroup)),
    ).sort((firstGroup, secondGroup) => firstGroup.localeCompare(secondGroup));

    return { economicGroups };
  }
}
