import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { EconomicGroupOptionsResponseDto } from '../../generated/epr-flow-control-api/model';
import { EconomicGroupService } from '../services/economic-group.service';

@ApiTags('economic-group')
@Controller('economic-groups')
export class EconomicGroupController {
  constructor(private readonly economicGroupService: EconomicGroupService) {}

  @Get()
  @ApiOperation({
    summary: 'List Economic Groups',
    description: 'This endpoint returns a list of economic groups that are available.',
  })
  @ApiResponse({
    status: 200,
    description: 'Economic groups retrieved successfully',
    schema: {
      example: {
        economicGroups: [
          'Grupo Econômico A',
          'Grupo Econômico B',
          'Grupo Econômico C',
        ],
      },
    },
  })
  list(): EconomicGroupOptionsResponseDto {
    return this.economicGroupService.list();
  }
}
