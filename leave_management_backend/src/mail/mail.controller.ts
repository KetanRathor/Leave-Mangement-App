import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';


@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

//   @Post('sendPasswordEmail')
//   async sendPasswordEmail(@Body() body: { email: string, password: string, fromEmail: string }): Promise<void> {
//     const { email, password, fromEmail } = body;
//     await this.mailService.sendPasswordEmail(email, password, fromEmail);
//   }




}
