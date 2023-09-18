import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModuleAsyncOptions} from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import {TypeOrmModule} from "@nestjs/typeorm";

/**
 * @description TypeOrmModuleAsyncOptions factory for TypeOrmModule.forRootAsync method
 * @return {TypeOrmModuleAsyncOptions}
 * @constructor
 * @see https://docs.nestjs.com/techniques/database#async-configuration
 */
export const OrmOptionsFactory : TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        applicationName: "ERP-API",
        autoLoadEntities: true,
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        ssl: true,
        extra: {
            ssl: {
                rejectUnauthorized: false
            }
        },
        synchronize: true,
        autoSave: true,
        logging: true,
        logger: "file",
        logNotifications: true,
    }),
};

/**
 * @description TypeOrmModule.forRootAsync method
 * @NOTE: This method is used to configure the TypeOrmModule synchronously (using forRoot) or asynchronously (using forRootAsync).
 * @see https://docs.nestjs.com/techniques/database#async-configuration
 * @see https://docs.nestjs.com/techniques/configuration#configuration-namespaces
 */
export default TypeOrmModule.forRootAsync(OrmOptionsFactory)