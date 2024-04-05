import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentials } from './entities/UserCredentials.entity';
import * as dotenv from 'dotenv';
import { LocalStrategy } from './Strategies/local.strategy';


dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCredentials])
    , PassportModule,
    JwtModule.register({
      global : true,
      secret: "ABC",
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
