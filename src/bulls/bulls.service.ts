import { Injectable, NotFoundException } from '@nestjs/common';
import { BullsRepository } from './repositories/bulls.repository';
import { QueryBullsDto } from './dto/query-bulls.dto';
import { BullResponseDto } from './dto/bull-response.dto';
import { BULL_SCORE_WEIGHTS } from './constants';

@Injectable()
export class BullsService {
  constructor(private bullsRepository: BullsRepository) {}

  async findAll(query: QueryBullsDto, userId?: number) {
    return this.bullsRepository.findAll(query, userId);
  }

  async findOne(id: number, userId?: number): Promise<BullResponseDto> {
    const bull = await this.bullsRepository.findOne(id, userId);

    if (!bull) {
      throw new NotFoundException(`Bull with ID ${id} not found`);
    }

    const bullScore = this.calculateBullScore(bull);

    return {
      id: bull.id,
      earTag: bull.earTag,
      name: bull.name,
      useType: bull.useType,
      origin: bull.origin,
      coat: bull.coat,
      breed: bull.breed,
      ageMonths: bull.ageMonths,
      standoutFeature: bull.standoutFeature,
      stats: {
        growth: Number(bull.growth),
        calvingEase: Number(bull.calvingEase),
        reproduction: Number(bull.reproduction),
        moderation: Number(bull.moderation),
        carcass: Number(bull.carcass),
      },
      bullScore,
      isFavorite: userId
        ? bull.favorites && bull.favorites.length > 0
        : false,
    };
  }

  async addFavorite(userId: number, bullId: number) {
    const bull = await this.bullsRepository.findOne(bullId);
    if (!bull) {
      throw new NotFoundException(`Bull with ID ${bullId} not found`);
    }

    return this.bullsRepository.addFavorite(userId, bullId);
  }

  async removeFavorite(userId: number, bullId: number) {
    const bull = await this.bullsRepository.findOne(bullId);
    if (!bull) {
      throw new NotFoundException(`Bull with ID ${bullId} not found`);
    }

    await this.bullsRepository.removeFavorite(userId, bullId);
    return { message: 'Favorite removed successfully' };
  }

  async getFavorites(userId: number, query: QueryBullsDto) {
    return this.bullsRepository.getFavorites(userId, query);
  }

  private calculateBullScore(bull: any): number {
    return (
      Number(bull.growth) * BULL_SCORE_WEIGHTS.GROWTH +
      Number(bull.calvingEase) * BULL_SCORE_WEIGHTS.CALVING_EASE +
      Number(bull.reproduction) * BULL_SCORE_WEIGHTS.REPRODUCTION +
      Number(bull.moderation) * BULL_SCORE_WEIGHTS.MODERATION +
      Number(bull.carcass) * BULL_SCORE_WEIGHTS.CARCASS
    );
  }
}
