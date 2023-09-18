import { PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto extends PartialType(User) {
  @IsString()
  @ApiProperty({ required: false })
  name?: string;

  @IsEmail()
  @ApiProperty({ required: false })
  email?: string;
}
