import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentials } from './entities/UserCredentials.entity';
import * as dotenv from 'dotenv';
import { MailModule } from 'src/mail/mail.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCredentials])
    , PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1d' },

    }),
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
