import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrmOptionsFactory } from './database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ValidationEnvSchema } from './environment';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: ValidationEnvSchema }),
    TypeOrmModule.forRootAsync(OrmOptionsFactory),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
