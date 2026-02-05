import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BullsService } from './bulls.service';
import { BullsRepository } from './repositories/bulls.repository';
import { QueryBullsDto } from './dto/query-bulls.dto';

describe('BullsService', () => {
  let service: BullsService;
  let repository: jest.Mocked<BullsRepository>;

  const mockBullEntity = {
    id: 1,
    earTag: 'TAG001',
    name: 'Toro Test',
    useType: 'vaquillona',
    origin: 'propio',
    coat: 'negro',
    breed: 'Angus',
    ageMonths: 24,
    standoutFeature: 'Crecimiento',
    growth: 80,
    calvingEase: 75,
    reproduction: 70,
    moderation: 65,
    carcass: 60,
    favorites: [],
  };

  const mockPaginatedResult = {
    data: [mockBullEntity],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      getFavorites: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BullsService,
        { provide: BullsRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<BullsService>(BullsService);
    repository = module.get(BullsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated bulls from repository', async () => {
      const query: QueryBullsDto = { page: 1, limit: 10 };
      repository.findAll.mockResolvedValue(mockPaginatedResult as any);

      const result = await service.findAll(query, 1);

      expect(repository.findAll).toHaveBeenCalledWith(query, 1);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should call repository without userId when not provided', async () => {
      const query: QueryBullsDto = {};
      repository.findAll.mockResolvedValue(mockPaginatedResult as any);

      await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query, undefined);
    });
  });

  describe('findOne', () => {
    it('should return bull with bullScore and isFavorite', async () => {
      repository.findOne.mockResolvedValue(mockBullEntity as any);

      const result = await service.findOne(1, 1);

      expect(repository.findOne).toHaveBeenCalledWith(1, 1);
      expect(result.id).toBe(1);
      expect(result.earTag).toBe('TAG001');
      expect(result.bullScore).toBeDefined();
      expect(typeof result.bullScore).toBe('number');
      expect(result.isFavorite).toBe(false);
    });

    it('should throw NotFoundException when bull does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Bull with ID 999 not found',
      );
    });
  });

  describe('addFavorite', () => {
    it('should add favorite when bull exists', async () => {
      repository.findOne.mockResolvedValue(mockBullEntity as any);
      repository.addFavorite.mockResolvedValue({ userId: 1, bullId: 1 } as any);

      const result = await service.addFavorite(1, 1);

      expect(repository.findOne).toHaveBeenCalledWith(1);
      expect(repository.addFavorite).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ userId: 1, bullId: 1 });
    });

    it('should throw NotFoundException when bull does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.addFavorite(1, 999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.addFavorite(1, 999)).rejects.toThrow(
        'Bull with ID 999 not found',
      );
      expect(repository.addFavorite).not.toHaveBeenCalled();
    });
  });

  describe('removeFavorite', () => {
    it('should remove favorite when bull exists', async () => {
      repository.findOne.mockResolvedValue(mockBullEntity as any);
      repository.removeFavorite.mockResolvedValue(undefined);

      const result = await service.removeFavorite(1, 1);

      expect(repository.findOne).toHaveBeenCalledWith(1);
      expect(repository.removeFavorite).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ message: 'Favorite removed successfully' });
    });

    it('should throw NotFoundException when bull does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.removeFavorite(1, 999)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.removeFavorite).not.toHaveBeenCalled();
    });
  });

  describe('getFavorites', () => {
    it('should delegate to repository', async () => {
      const query: QueryBullsDto = {};
      repository.getFavorites.mockResolvedValue(mockPaginatedResult as any);

      const result = await service.getFavorites(1, query);

      expect(repository.getFavorites).toHaveBeenCalledWith(1, query);
      expect(result).toEqual(mockPaginatedResult);
    });
  });
});
