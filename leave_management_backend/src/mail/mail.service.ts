import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { UserCredentials } from 'src/auth/entities/UserCredentials.entity';
import { Repository } from 'typeorm';
// import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MailService {
    private transporter;
    
    // private generatedPassword: string;
    constructor(
        // private  authService : AuthService
        // @InjectRepository(UserCredentials)
        // private readonly userCredentialsRepository: Repository<UserCredentials>
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

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Account Information',
            text: `Hello,\n\nYour account has been created successfully. Your password is: ${password}\n\nRegards,\nThe Admin Team`
        };

       
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending password email:', error);
                
            } else {
                console.log('Email sent:', info.response);
            }
        });
    }

    
    async sendOTPEmail(email: string, otp: string){
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Password Reset',
            text: `Hello,\n\nYour OTP for password reset is: ${otp}\n\nRegards,\nThe Admin Team`
        };
        // await this.sendOTPEmail(email,otp);

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP email:', error);
            } else {
                console.log('OTP Email sent:', info.response);
            }
        });
    }

    async sendPasswordResetEmail(email: string){
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Successfully',
            text: `Hello,\n\n Your password has been reset successfully. \n\nRegards,\nThe Admin Team`
        };
        // await this.sendOTPEmail(email,otp);

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP email:', error);
            } else {
                console.log('OTP Email sent:', info.response);
            }
        });
    }


    async sendLeaveRequestEmail(email: string, manager_email:string,reason:string){
    
            const adminMailOptions = {
                from: email,
                to: process.env.EMAIL_USER,
                subject: `Leave request for: ${email}`,
                text: `A leave request has been submitted by ${email}. Please review and take necessary actions.`,
            };
            
            const managerMailOptions = {
                from: email,
                to: manager_email,
                subject: `Leave request for: ${email}`,
                text: `Hello,\n\n${reason}.\n\nRegards,\nThe Admin Team`,
            };
            
            
            await Promise.all([
                this.transporter.sendMail(adminMailOptions),
                this.transporter.sendMail(managerMailOptions),
            ]);
            
        }




    

    
}