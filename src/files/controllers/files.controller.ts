import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { FilesService } from '../services/files.service';
import { FileResponseDto } from '../dto/file-response.dto';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':correlationId')
  @ApiOperation({
    summary: 'Get file info by correlation ID',
    description: 'Returns file metadata for a given report correlationId.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved file info', type: FileResponseDto })
  @ApiResponse({ status: 404, description: 'File not found' })
  getFile(@Param('correlationId') correlationId: string, @Req() req: Request): FileResponseDto {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.filesService.getFile(correlationId, baseUrl);
  }

  @Get(':correlationId/download')
  @ApiOperation({
    summary: 'Download file by correlation ID',
    description: 'Returns the binary PDF file for a given report correlationId.',
  })
  @ApiResponse({ status: 200, description: 'Successfully downloaded file' })
  @ApiResponse({ status: 404, description: 'File not found' })
  downloadFile(
    @Param('correlationId') correlationId: string,
    @Res() res: Response,
  ): void {
    const { fileName, content } = this.filesService.getDownload(correlationId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(content);
  }
}
