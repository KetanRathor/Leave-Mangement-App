import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { PassportModule } from '@nestjs/passport';
// import { EmployeeModule } from 'src/employee/employee.module';
// import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentials } from 'src/employee/entities/UserCredentials.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './Strategies/local.strategy';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserCredentials]),
    PassportModule,
    JwtModule.register({
      secret:'abc123',
      signOptions: {expiresIn:'1h'},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
