import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthenticationGuard } from './guards/local-auth.guard';
import RequestWithUser from './interfaces/request-with-user.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Get authenticated user',
    type: User,
  })
  async auth(@Req() request: RequestWithUser): Promise<User> {
    const { user } = request;
    return user;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() registrationData: CreateUserDto): Promise<User> {
    return this.authService.register(registrationData);
  }

  @ApiOperation({
    summary: 'Login (APP)',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                example: 'test@example.com',
              },
              password: {
                type: 'string',
                example: 'my-very-strong-password',
              },
            },
          },
        },
      },
    },
  })
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(
    @Req() request: RequestWithUser,
  ): Promise<{ user: User; token: string }> {
    const { user } = request;
    const token = this.authService.generateToken(user.id);
    return { user, token };
  }
}
