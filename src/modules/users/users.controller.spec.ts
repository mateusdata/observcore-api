import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      mockUsersService.create.mockResolvedValue({
        ...mockUser,
        email: createUserDto.email,
        name: createUserDto.name,
      });

      const result = await controller.create(createUserDto);

      expect(result.email).toBe('newuser@example.com');
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findMe', () => {
    it('should return current user data', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findMe('user-uuid-123');

      expect(result.id).toBe('user-uuid-123');
      expect(mockUsersService.findOne).toHaveBeenCalledWith('user-uuid-123');
    });
  });

  describe('update', () => {
    it('should update current user', async () => {
      const updateUserDto = { name: 'Updated Name' };

      mockUsersService.update.mockResolvedValue({
        ...mockUser,
        name: 'Updated Name',
      });

      const result = await controller.update('user-uuid-123', updateUserDto);

      expect(result.name).toBe('Updated Name');
      expect(mockUsersService.update).toHaveBeenCalledWith('user-uuid-123', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove current user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove('user-uuid-123');

      expect(mockUsersService.remove).toHaveBeenCalledWith('user-uuid-123');
    });
  });
});
