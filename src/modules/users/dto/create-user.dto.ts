import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'Kareem Zayed',
    type: () => String,
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'kareem.adel.zayed@gmail.com',
    type: () => String,
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
    type: () => String,
    required: true,
  })
  @IsNotEmpty()
  password: string;
}
