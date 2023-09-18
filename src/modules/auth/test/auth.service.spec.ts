import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        ConfigService,
        JwtService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(),
            comparePassword: jest.fn(),
          },
        },
        // Add other dependencies as needed
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return a user when authentication is successful', async () => {
    const mockUser = { email: 'test@example.com', comparePassword: jest.fn() };
    usersService.getUserByEmail = jest.fn().mockResolvedValue(mockUser);
    mockUser.comparePassword.mockResolvedValue(true);

    const user = await authService.getAuthenticatedUser(
      'test@example.com',
      'password',
    );
    expect(user).toEqual(mockUser);
  });

  /*  it('should throw an error when authentication fails', async () => {
    usersService.getUserByEmail = jest.fn().mockResolvedValue(null);

    await expect(authService.getAuthenticatedUser('test@example.com', 'password')).rejects.toThrowError('Invalid email or password');
  });
  */
  it('should throw an error when user does not exist', async () => {
    usersService.getUserByEmail = jest.fn().mockResolvedValue(null);
    await expect(
      authService.getAuthenticatedUser('nonexistent@example.com', 'password'),
    ).rejects.toThrowError('Invalid password');
  });

  it('should throw an error when authentication fails', async () => {
    const mockUser = { email: 'test@example.com', comparePassword: jest.fn() };
    usersService.getUserByEmail = jest.fn().mockResolvedValue(mockUser);
    mockUser.comparePassword.mockResolvedValue(false);

    await expect(
      authService.getAuthenticatedUser('test@example.com', 'incorrectPassword'),
    ).rejects.toThrowError('Invalid password');
  });
});
