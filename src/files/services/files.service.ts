import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportsRepository } from '@/reports/repositories/reports.repository';
import { FileResponseDto } from '../dto/file-response.dto';

@Injectable()
export class FilesService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  getFile(correlationId: string, baseUrl: string): FileResponseDto {
    const report = this.reportsRepository.findByCorrelationId(correlationId);

    if (!report) {
      throw new NotFoundException(`File not found for correlationId ${correlationId}`);
    }

    const referenceMonth = String(report.referenceMonth).padStart(2, '0');

    return {
      fileName: `relatorio-${report.uc.toLowerCase()}-${report.referenceYear}-${referenceMonth}.pdf`,
      downloadUrl: `${baseUrl}/files/${correlationId}/download`,
      createdBy: 'mock.api',
      updatedAt: report.updatedAt.toISOString(),
    };
  }

  getDownload(correlationId: string): { fileName: string; content: Buffer } {
    const report = this.reportsRepository.findByCorrelationId(correlationId);

    if (!report) {
      throw new NotFoundException(`File not found for correlationId ${correlationId}`);
    }

    const referenceMonth = String(report.referenceMonth).padStart(2, '0');
    const fileName = `relatorio-${report.uc.toLowerCase()}-${report.referenceYear}-${referenceMonth}.pdf`;

    return {
      fileName,
      content: this.createMockPdfContent(fileName),
    };
  }

  private createMockPdfContent(fileName: string): Buffer {
    const safeFileName = fileName.replace(/[()]/g, '');
    const pdf = `%PDF-1.1
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 89 >>
stream
BT
/F1 18 Tf
72 720 Td
(Mock PDF) Tj
0 -28 Td
/F1 12 Tf
(${safeFileName}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000063 00000 n 
0000000122 00000 n 
0000000248 00000 n 
0000000387 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
457
%%EOF`;

    return Buffer.from(pdf, 'utf-8');
  }
}
