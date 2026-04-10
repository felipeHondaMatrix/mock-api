import { Module } from '@nestjs/common';
import { ReportsModule } from '../reports/reports.module';
import { EconomicGroupController } from './controllers/economic-group.controller';
import { EconomicGroupService } from './services/economic-group.service';

@Module({
  imports: [ReportsModule],
  controllers: [EconomicGroupController],
  providers: [EconomicGroupService],
})
export class EconomicGroupModule {}
