import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
// import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserCredentials } from 'src/auth/entities/UserCredentials.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // imports:[AuthModule,TypeOrmModule.forFeature([UserCredentials])],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
