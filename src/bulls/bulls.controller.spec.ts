import { Test, TestingModule } from '@nestjs/testing';
import { BullsController } from './bulls.controller';
import { BullsService } from './bulls.service';
import { QueryBullsDto } from './dto/query-bulls.dto';

describe('BullsController', () => {
  let controller: BullsController;
  let bullsService: jest.Mocked<BullsService>;

  const mockUser = { id: 1, email: 'user@test.com' };
  const mockPaginatedResult = {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };
  const mockBullResponse = {
    id: 1,
    earTag: 'TAG001',
    name: 'Toro',
    bullScore: 72,
    isFavorite: false,
  };

  beforeEach(async () => {
    const mockBullsService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      getFavorites: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BullsController],
      providers: [{ provide: BullsService, useValue: mockBullsService }],
    }).compile();

    controller = module.get<BullsController>(BullsController);
    bullsService = module.get(BullsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated bulls', async () => {
      const query: QueryBullsDto = {};
      bullsService.findAll.mockResolvedValue(mockPaginatedResult as any);

      const result = await controller.findAll(query, mockUser);

      expect(bullsService.findAll).toHaveBeenCalledWith(query, mockUser?.id);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return a bull by id', async () => {
      bullsService.findOne.mockResolvedValue(mockBullResponse as any);

      const result = await controller.findOne(1, mockUser);

      expect(bullsService.findOne).toHaveBeenCalledWith(1, mockUser?.id);
      expect(result).toEqual(mockBullResponse);
    });
  });

  describe('getFavorites', () => {
    it('should return user favorites', async () => {
      const query: QueryBullsDto = {};
      bullsService.getFavorites.mockResolvedValue(mockPaginatedResult as any);

      const result = await controller.getFavorites(query, mockUser);

      expect(bullsService.getFavorites).toHaveBeenCalledWith(mockUser.id, query);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('addFavorite', () => {
    it('should add favorite for user', async () => {
      bullsService.addFavorite.mockResolvedValue({ userId: 1, bullId: 1 } as any);

      const result = await controller.addFavorite(1, mockUser);

      expect(bullsService.addFavorite).toHaveBeenCalledWith(mockUser.id, 1);
      expect(result).toEqual({ userId: 1, bullId: 1 });
    });
  });

  describe('removeFavorite', () => {
    it('should remove favorite for user', async () => {
      bullsService.removeFavorite.mockResolvedValue({
        message: 'Favorite removed successfully',
      } as any);

      const result = await controller.removeFavorite(1, mockUser);

      expect(bullsService.removeFavorite).toHaveBeenCalledWith(mockUser.id, 1);
      expect(result).toEqual({ message: 'Favorite removed successfully' });
    });
  });
});
