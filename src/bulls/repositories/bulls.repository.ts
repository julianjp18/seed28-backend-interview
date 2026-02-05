import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Bull } from '../entities/bull.entity';
import { Favorite } from '../entities/favorite.entity';
import { QueryBullsDto } from '../dto/query-bulls.dto';
import { BULL_SCORE_WEIGHTS } from '../constants';

@Injectable()
export class BullsRepository {
  constructor(
    @InjectRepository(Bull)
    private bullRepository: Repository<Bull>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  async findAll(query: QueryBullsDto, userId?: number) {
    const queryBuilder = this.bullRepository
      .createQueryBuilder('bull')
      .leftJoinAndSelect(
        'bull.favorites',
        'favorite',
        userId ? 'favorite.userId = :userId' : '1=0',
        userId ? { userId } : {},
      );

    // Calculate bull_score in query (same weights as BULL_SCORE_WEIGHTS)
    queryBuilder.addSelect(
      `(bull.growth * ${BULL_SCORE_WEIGHTS.GROWTH} + bull.calving_ease * ${BULL_SCORE_WEIGHTS.CALVING_EASE} + bull.reproduction * ${BULL_SCORE_WEIGHTS.REPRODUCTION} + bull.moderation * ${BULL_SCORE_WEIGHTS.MODERATION} + bull.carcass * ${BULL_SCORE_WEIGHTS.CARCASS})`,
      'bull_score',
    );

    this.applyFilters(queryBuilder, query, userId);

    const total = await queryBuilder.getCount();

    const sortOrder = query.sortBy === 'asc' ? 'ASC' : 'DESC';
    queryBuilder.orderBy('bull_score', sortOrder);

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const { entities, raw } = await queryBuilder.getRawAndEntities();

    const bullsWithScore = entities.map((bull, index) => {
      const bullScore = raw[index]
        ? parseFloat(raw[index].bull_score) || this.calculateBullScore(bull)
        : this.calculateBullScore(bull);

      return {
        ...bull,
        bullScore,
        isFavorite: userId
          ? bull.favorites && bull.favorites.length > 0
          : false,
      };
    });

    return {
      data: bullsWithScore,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private applyFilters(
    qb: SelectQueryBuilder<Bull>,
    query: QueryBullsDto,
    userId?: number,
  ) {
    // Search (ear_tag or name)
    if (query.search) {
      qb.andWhere(
        '(bull.ear_tag ILIKE :search OR bull.name ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.origin === 'favoritos' && userId) {
      qb.andWhere('favorite.userId = :userId', { userId });
    } else if (query.origin && query.origin !== 'favoritos') {
      qb.andWhere('bull.origin = :origin', { origin: query.origin });
    }

    if (query.forHeifer === true) {
      qb.andWhere('bull.use_type = :uso', { uso: 'vaquillona' });
    }

    if (query.coat) {
      qb.andWhere('bull.coat = :coat', { coat: query.coat });
    }
  }

  private calculateBullScore(bull: Bull): number {
    return (
      Number(bull.growth) * BULL_SCORE_WEIGHTS.GROWTH +
      Number(bull.calvingEase) * BULL_SCORE_WEIGHTS.CALVING_EASE +
      Number(bull.reproduction) * BULL_SCORE_WEIGHTS.REPRODUCTION +
      Number(bull.moderation) * BULL_SCORE_WEIGHTS.MODERATION +
      Number(bull.carcass) * BULL_SCORE_WEIGHTS.CARCASS
    );
  }

  async findOne(id: number, userId?: number): Promise<Bull | null> {
    const queryBuilder = this.bullRepository
      .createQueryBuilder('bull')
      .where('bull.id = :id', { id })
      .leftJoinAndSelect(
        'bull.favorites',
        'favorite',
        userId ? 'favorite.userId = :userId' : '1=0',
        userId ? { userId } : {},
      );

    return queryBuilder.getOne();
  }

  async addFavorite(userId: number, bullId: number): Promise<Favorite> {
    const existing = await this.favoriteRepository.findOne({
      where: { userId, bullId },
    });

    if (existing) {
      return existing;
    }

    const favorite = this.favoriteRepository.create({ userId, bullId });
    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(userId: number, bullId: number): Promise<void> {
    await this.favoriteRepository.delete({ userId, bullId });
  }

  async getFavorites(userId: number, query: QueryBullsDto) {
    // Primero obtener IDs de favoritos
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      select: ['bullId'],
    });

    const bullIds = favorites.map((f) => f.bullId);

    if (bullIds.length === 0) {
      return {
        data: [],
        total: 0,
        page: query.page || 1,
        limit: query.limit || 10,
        totalPages: 0,
      };
    }

    // Apply filters over favorites
    const queryWithFavorites = {
      ...query,
      origin: 'favoritos' as any,
    };

    return this.findAll(queryWithFavorites, userId);
  }
}
