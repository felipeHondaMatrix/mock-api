import { Module } from '@nestjs/common';
import { BillingModule } from './billing/billing.module';
import { FilesModule } from './files/files.module';
import { HealthModule } from './health/health.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [BillingModule, FilesModule, HealthModule, ReportsModule],
})
export class AppModule {}
