import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullsController } from './bulls.controller';
import { BullsService } from './bulls.service';
import { Bull } from './entities/bull.entity';
import { Favorite } from './entities/favorite.entity';
import { BullsRepository } from './repositories/bulls.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Bull, Favorite])],
  controllers: [BullsController],
  providers: [BullsService, BullsRepository],
  exports: [BullsService],
})
export class BullsModule {}
