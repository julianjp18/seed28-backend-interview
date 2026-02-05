import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BullsService } from './bulls.service';
import { QueryBullsDto } from './dto/query-bulls.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('bulls')
@UseGuards(JwtAuthGuard)
export class BullsController {
  constructor(private readonly bullsService: BullsService) {}

  @Get()
  async findAll(
    @Query() query: QueryBullsDto,
    @CurrentUser() user: any,
  ) {
    return this.bullsService.findAll(query, user?.id);
  }

  @Get('favorites')
  async getFavorites(
    @Query() query: QueryBullsDto,
    @CurrentUser() user: any,
  ) {
    return this.bullsService.getFavorites(user.id, query);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.bullsService.findOne(id, user?.id);
  }

  @Post(':id/favorite')
  async addFavorite(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.bullsService.addFavorite(user.id, id);
  }

  @Delete(':id/favorite')
  async removeFavorite(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.bullsService.removeFavorite(user.id, id);
  }
}
