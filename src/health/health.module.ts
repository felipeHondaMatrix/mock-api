import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { BillingController } from './controllers/billing.controller';
import { HealthService } from './services/health.service';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [ReportsModule], // Import ReportsModule to access ReportsRepository
  controllers: [HealthController, BillingController],
  providers: [HealthService],
})
export class HealthModule {}
