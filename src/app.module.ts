import { Module } from '@nestjs/common';
import { BillingModule } from './billing/billing.module';
import { HealthModule } from './health/health.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [BillingModule, HealthModule, ReportsModule],
})
export class AppModule {}
