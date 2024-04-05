import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('MYSQL_HOST', 'localhost'),
        // port: configService.getOrThrow('MYSQL_PORT'),
        database: configService.getOrThrow('MYSQL_DATABASE','leave_management_system'),
        username: configService.getOrThrow('MYSQL_USERNAME','root'),
        password: configService.getOrThrow('MYSQL_PASSWORD','shruti123'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE', true),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}