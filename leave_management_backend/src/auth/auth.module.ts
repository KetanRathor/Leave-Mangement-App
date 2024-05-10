import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentials } from './entities/UserCredentials.entity';
import * as dotenv from 'dotenv';
import { MailModule } from 'src/mail/mail.module';
import { Employee } from 'src/employee/entities/Employee.entity';
import { UserOtp } from './entities/userOtp.entity';
import { GoogleStrategy } from './GoogleStrategy';
import { SessionSerializer } from './utils/Serializer';
// import { MailService } from 'src/mail/mail.service';
// import { Employee } from 'src/employee/entities/Employee.entity';
// import { EmployeeModule } from 'src/employee/employee.module';
// import { EmployeeService } from 'src/employee/employee.service';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCredentials,Employee,UserOtp])
    , PassportModule,
    // JwtModule
    
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1d' },
      
      
    }),
    MailModule,
    // EmployeeModule
    
  ],
  controllers: [AuthController],
  providers: [GoogleStrategy,
    SessionSerializer,
    {
      provide:'AUTH_SERVICE',
      useClass:AuthService,
    }

  ],
  // exports: [AuthService]
})
export class AuthModule { }
