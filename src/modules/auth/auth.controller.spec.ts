import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    create: jest.fn(),
    refreshToken: jest.fn(),
    sendEmailCode: jest.fn(),
    validateCode: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.create with credentials and return token', async () => {
      const loginDto = { email: 'test@example.com', password: '123456' };
      const expectedResult = {
        id: 'user-id',
        email: 'test@example.com',
        token: 'jwt-token',
        expiresIn: 1234567890,
      };

      mockAuthService.create.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.create).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refresh', () => {
    it('should call authService.refreshToken and return new token', async () => {
      const refreshDto = { token: 'old-token' };
      const expectedResult = { token: 'new-jwt-token' };

      mockAuthService.refreshToken.mockResolvedValue(expectedResult);

      const result = await controller.refresh(refreshDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith('old-token');
    });
  });

  describe('sendCode', () => {
    it('should call authService.sendEmailCode', async () => {
      const sendCodeDto = { email: 'test@example.com' };
      const expectedResult = { message: 'Código enviado', email: 'test@example.com' };

      mockAuthService.sendEmailCode.mockResolvedValue(expectedResult);

      const result = await controller.sendCode(sendCodeDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.sendEmailCode).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('validateCode', () => {
    it('should call authService.validateCode', async () => {
      const validateDto = { email: 'test@example.com', code: '123456' };
      const expectedResult = { message: 'Código validado com sucesso' };

      mockAuthService.validateCode.mockResolvedValue(expectedResult);

      const result = await controller.validateCode(validateDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.validateCode).toHaveBeenCalledWith('test@example.com', '123456');
    });
  });

  describe('changePassword', () => {
    it('should call authService.changePassword', async () => {
      const changePasswordDto = {
        email: 'test@example.com',
        code: '123456',
        password: 'newpassword',
      };
      const expectedResult = { message: 'Senha alterada com sucesso' };

      mockAuthService.changePassword.mockResolvedValue(expectedResult);

      const result = await controller.changePassword(changePasswordDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.changePassword).toHaveBeenCalledWith(
        'test@example.com',
        changePasswordDto
      );
    });
  });
});
