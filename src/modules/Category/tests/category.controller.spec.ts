import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/PrismaService';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { CategoryDTO } from '../models/categoryModels';
import { mockCategories, mockCategory, mockCategoryDTO } from './category.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;
  let prisma: PrismaService;

  const categoryArray = mockCategories;

  const singleCategory = mockCategory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        PrismaService,
        {
          provide: CategoryService,
          useValue: {
            create: jest.fn((dto: CategoryDTO) => ({
              id: Date.now(),
              ...dto,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
            findAll: jest.fn().mockResolvedValue(mockCategories),
            findOne: jest.fn().mockResolvedValue(singleCategory),
            update: jest
              .fn()
              .mockImplementation((id: number, dto: CategoryDTO) => ({
                id,
                ...dto,
                updatedAt: new Date().toISOString(),
              })),
            delete: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should create a category', async () => {
    const newCategoryDto: CategoryDTO = mockCategoryDTO;
    const result = await controller.create(newCategoryDto);
    expect(result).toEqual(expect.objectContaining(newCategoryDto));
  });

  it('should find all categories', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(categoryArray);
  });

  it('should find one category', async () => {
    const id = 1;
    const result = await controller.findOne(id.toString());
    expect(result).toEqual(singleCategory);
  });

  it('should update a category', async () => {
    const updateCategoryDto: CategoryDTO = mockCategoryDTO;
    const id = 1;
    const result = await controller.update(id.toString(), updateCategoryDto);
    expect(result).toEqual(expect.objectContaining(updateCategoryDto));
  });

  it('should delete a category', async () => {
    const id = 1;
    const result = await controller.delete(id.toString());
    expect(result).toEqual({ deleted: true });
  });
});
