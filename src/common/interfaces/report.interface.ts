import { ReportStatus } from '../enums/report-status.enum';

export interface Report {
  id: number;
  uc: string;
  meterPoint: string;
  nickname: string;
  referenceMonth: number; // 1-12
  referenceYear: number; // YYYY
  economicGroup: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}
