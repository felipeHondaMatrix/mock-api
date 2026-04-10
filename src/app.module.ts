import { Module } from '@nestjs/common';
import { BillingModule } from './billing/billing.module';
import { EconomicGroupModule } from './economic-group/economic-group.module';
import { FilesModule } from './files/files.module';
import { HealthModule } from './health/health.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [BillingModule, EconomicGroupModule, FilesModule, HealthModule, ReportsModule],
})
export class AppModule {}
