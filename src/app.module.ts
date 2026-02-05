import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [HealthModule, ReportsModule],
})
export class AppModule {}
