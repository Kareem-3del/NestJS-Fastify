import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

/**
 * @description TypeOrmModuleAsyncOptions factory for TypeOrmModule.forRootAsync method
 * @return {TypeOrmModuleAsyncOptions}
 * @constructor
 * @see https://docs.nestjs.com/techniques/database#async-configuration
 */
export const OrmOptionsFactory: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    applicationName: 'ERP-API',
    autoLoadEntities: true,
    entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
    /*
    // For Online Database [Public]
      ssl: false,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },

      */
    synchronize: true,
    autoSave: true,
    logging: true,
    logger: 'file',
    logNotifications: true,
  }),
};
