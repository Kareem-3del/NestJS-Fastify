import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { IAuthPayload } from './interfaces/auth-payload.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @description Generate One Time Auth Code for user
   * @param userId
   * @return {string}
   */
  generateToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        algorithm: 'HS384',
      },
    );
  }

  /**
   * @description Trigger refresh token for user
   * @param query
   */
  async triggerRefreshToken(query: string): Promise<string> {
    const profile: User = await this.usersService.getUser(query);
    const payload: IAuthPayload = { userId: profile.id, iat: Date.now() };
    profile.refresh_token = this.jwtService.sign(
      payload,
      this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
    );
    await this.usersService.update(profile.id, profile);
    return profile.refresh_token;
  }

  /**
   * @description Generate One Time Auth Code for user
   * @param email
   * @param plainTextPassword
   */
  async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!(await user?.comparePassword(plainTextPassword)))
      throw new BadRequestException('Invalid password');
    return user;
  }

  /**
   * @description Register a new user
   * @param registrationData
   * @return {User}
   */

  async register(registrationData: CreateUserDto): Promise<User> {
    return await this.usersService.create(registrationData);
  }
}
