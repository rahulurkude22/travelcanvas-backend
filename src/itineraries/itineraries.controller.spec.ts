import { Test, TestingModule } from '@nestjs/testing';
import { ItinerariesSearchDto } from './dto/itineraries-search.dto';
import { ItinerariesController } from './itineraries.controller';
import { ItinerariesService } from './itineraries.service';
import { InferSelectModel } from 'drizzle-orm';
import { itineraries } from 'drizzle/migrations/schema';

type Itinerary = InferSelectModel<typeof itineraries>;

describe('ItinerariesController', () => {
  let controller: ItinerariesController;
  let service: ItinerariesService;

  const mockItinerariesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItinerariesController],
      providers: [
        {
          provide: ItinerariesService,
          useValue: mockItinerariesService,
        },
      ],
    }).compile();

    controller = module.get<ItinerariesController>(ItinerariesController);
    service = module.get<ItinerariesService>(ItinerariesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of itineraries', async () => {
      const query: ItinerariesSearchDto = {
        search: 'Trip',
        category: '',
        limit: '10',
        page: '1',
        my_itineraries: false,
        sort: 'latest',
      };

      const expected: Itinerary[] = [
        {
          id: '43be3b76-faeb-4946-bf9b-68fd4022c10f',
          userId: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Trip to mars',
          description: 'We are going to Thailand.',
          destination:
            'We are going to explore whether there is water on mars.',
          durationDays: 6,
          canvasData: {
            elements: [],
          },
          thumbnailUrl: null,
          isPublic: false,
          isTemplate: false,
          price: '0.00',
          currency: 'USD',
          tags: null,
          viewCount: 0,
          likeCount: 0,
          createdAt: '2025-09-13 11:48:41.912602+05:30',
          updatedAt: '2025-09-16 10:53:27.136025+05:30',
          coverImageUrl: null,
          totalEstimatedCost: null,
          difficultyLevel: null,
          groupSizeMin: 1,
          groupSizeMax: null,
          ageRestriction: null,
          seasonBest: null,
          includes: null,
          excludes: null,
          totalDays: null,
          createdBy: null,
          isFeatured: null,
          category: null,
        },
      ];

      mockItinerariesService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });
});
