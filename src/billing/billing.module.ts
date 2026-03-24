import { Module } from '@nestjs/common';
import { ReportsModule } from '../reports/reports.module';
import { BillingController } from './controllers/billing.controller';
import { BillingService } from './services/billing.service';

@Module({
  imports: [ReportsModule],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
