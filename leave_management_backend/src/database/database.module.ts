// import { Module } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';

// @Module({
//     imports: [
//         TypeOrmModule.forRootAsync({
//             useFactory: (configService: ConfigService) => ({
//                 type: configService.getOrThrow('DB_TYPE'),
//                 port: configService.getOrThrow('MYSQL_PORT'),
//                 host: configService.getOrThrow('MYSQL_HOST'),
//                 username: configService.getOrThrow('MYSQL_USER'),
//                 password: configService.getOrThrow('MYSQL_PASSWORD'),
//                 database: configService.getOrThrow('MYSQL_DATABASE'),
//                 autoLoadEntities: true,
//                 synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
//             }),
//             inject: [ConfigService],
//         })
//     ]
// })
// export class DatabaseModule { }



import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('MYSQL_HOST'),
        port: configService.getOrThrow('MYSQL_PORT'),
        database: configService.getOrThrow('MYSQL_DATABASE'),
        username: configService.getOrThrow('MYSQL_USERNAME'),
        password: configService.getOrThrow('MYSQL_PASSWORD'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}