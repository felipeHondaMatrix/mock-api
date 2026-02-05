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

export interface ReportItem {
  id: number;
  uc: string;
  meterPoint: string;
  nickname: string;
  referenceDate: string; // "MM/YYYY"
  economicGroup: string;
  status: ReportStatus;
  url: string;
}
