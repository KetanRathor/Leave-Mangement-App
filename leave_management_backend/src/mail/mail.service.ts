import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MailService {
    private transporter;
    
    // private generatedPassword: string;
    constructor(
        private  authService : AuthService
        ) 
    
    {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    
    
    async sendPasswordEmail(email: string,password:string): Promise<void> {
    //     const generatedPassword = this.authService.generateRandomPassword(10);
    // const encryptedPassword = this.authService.encrypt(generatedPassword);
    // const originalPassword = this.authService.decrypt(encryptedPassword);
    // console.log("New Password:", originalPassword)

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Account Information',
            text: `Hello,\n\nYour account has been created successfully. Your password is: ${password}\n\nRegards,\nThe Admin Team`
        };


        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending password email:', error);
                // Handle error gracefully, maybe log it or do something else
            } else {
                console.log('Email sent:', info.response);
            }
        });
    }
}