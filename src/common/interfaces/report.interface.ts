import { ReportStatus } from '../enums/report-status.enum';

export interface Report {
  correlationId: string;
  codeUc: string;
  nickname: string;
  referenceDate: string; // "YYYY-MM-DD"
  economicGroup: string;
  reportStatus: ReportStatus;
  updatedAt: string;
  ingestedAt: string;
  builtAt: string;
  sentAt: string;
}

export type ReportItem = Report;
