import { Module } from '@nestjs/common';
import { ReportsModule } from '@/reports/reports.module';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';

@Module({
  imports: [ReportsModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
