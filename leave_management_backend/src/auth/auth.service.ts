import { HttpException, HttpStatus, Injectable, Post, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from './entities/UserCredentials.entity';
import { FindOneOptions, IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import * as dotenv from 'dotenv';
import { MailService } from 'src/mail/mail.service';
import { Employee } from 'src/employee/entities/Employee.entity';
import { UserOtp } from './entities/userOtp.entity';
import { UserDetails } from './utils/types';
import { OAuth2Client, auth } from 'google-auth-library';
import { profile } from 'console';
import axios from 'axios';
dotenv.config();

@Injectable()
export class AuthService {

    private readonly iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
    private readonly otpTTL = 300000;
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserCredentials)
        private readonly userCredentialsRepository: Repository<UserCredentials>,
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
        @InjectRepository(UserOtp)
        private readonly userOtp: Repository<UserOtp>,
        private readonly mailService: MailService,
        // private employeeService : EmployeeService
    ) { }

    async showProfile(id: number): Promise<any> {
        try {
            const employee = await this.employeeRepository.findOne({
                where: { id, deleted_at: IsNull() },
                // relations: ['manager', 'department', 'inventories', 'project'],
            });
            const managerIDs = await this.employeeRepository.find({
                where: { deleted_at: IsNull() },
                // select: ['manager_id'],

                // relations: ['manager'], 
            });
            if (employee) {
                let role;
                if (employee.admin) {
                    role = 'Admin';
                } else if (managerIDs.some(manager => manager.manager_id === employee.id)) {

                    role = 'Manager';
                } else {
                    role = 'Employee';
                }

                return { ...employee, role };

            } else {
                // return null;
                return {message:"user deleted"};
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async validateUserGoogle(details:UserDetails){
        console.log("*************************************")
            console.log('AuthService');
            console.log(details);
            let user = await this.employeeRepository.findOneBy({email:details.email});
            // user.created_by=
            console.log(user);
            if (user) {
                if (user.deleted_at || user.deleted_by) {
                    console.log('User is soft-deleted. Restoring...');
                    user.deleted_at = null;
                    user.deleted_by = null;
                    user.department_id=null;
                    user.manager_id=null;
                    user.admin = false;
                    user.name = details.name; 
                    await this.employeeRepository.save(user);
                    return user;
                  } else {
                    console.log('User found. Updating...');
                    // Update existing user's details if desired
                    user.name = details.name; // Update other details as needed
                    await this.employeeRepository.save(user);
                    return user;
                  }
                // console.log('User found. Updating...');
                // user = { ...user, ...details }; 
                // console.log("user............",user)
                // return this.employeeRepository.save(user);
            } else {
                
                console.log('User not found. Creating...');
                const newUser = this.employeeRepository.create({...details,created_by:details.email});
               
                console.log("details............",details)
                console.log("newUser............",newUser)
                return this.employeeRepository.save(newUser);
            }
    }

        async findUser(id:number){
        const user = await this.employeeRepository.findOneBy({id});
        return user;
        }

        googleLogin(req:any){
            if(!req.user){
                return 'No user from google'
            }
            console.log("req.user......",req)
            console.log("req......",req.user)
            return{
                message:'User Info from Google',
                user:req.user
            }

        }

        async refreshAccessToken(refreshToken: string) {
            try {
              const url = 'https://oauth2.googleapis.com/token';
              const data = {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
              };
              const response = await axios.post(url, data);
              return response.data.access_token;
            } catch (error) {
              console.error('Error refreshing token:', error);
              throw new HttpException('Refresh token failed', HttpStatus.UNAUTHORIZED);
            }
          }
}



































    // encrypt(text: string): string {
    //     console.log("tets", text)
    //     const cipher = crypto.createCipheriv(process.env.ALGORITHM, process.env.ENCRYPTION_KEY, this.iv);
    //     console.log("key", process.env.ENCRYPTION_KEY)
    //     let encrypted = cipher.update(text, 'utf8', 'hex');
    //     console.log("first", encrypted);
    //     encrypted += cipher.final('hex');
    //     console.log("finalenc", encrypted);
    //     return encrypted;
    // }

    // decrypt(encryptedText: string): string {
    //     // console.log("Tesxttttt",encryptedText)
    //     // console.log("Key", this.key );

    //     console.log("key dec", process.env.ENCRYPTION_KEY)
    //     const decipher = crypto.createDecipheriv(process.env.ALGORITHM, process.env.ENCRYPTION_KEY, this.iv);
    //     let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    //     decrypted += decipher.final('utf8');
    //     console.log("decrypted : ", decrypted);

    //     return decrypted;
    // }

    


    // generateRandomPassword(length: number): string {
    //     const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    //     let password = '';
    //     for (let i = 0; i < length; i++) {
    //         const randomIndex = Math.floor(Math.random() * charset.length);
    //         password += charset[randomIndex];
    //     }
    //     console.log("password", password)
    //     return password;
    // }

    // generateOTP() {
    //     const digits = '0123456789';
    //     let OTP = '';
    //     for (let i = 0; i < 6; i++) {
    //         const randomIndex = Math.floor(Math.random() * digits.length);
    //         OTP += digits[randomIndex];
    //     }
    //     return OTP;
    // }

    // async forgotPassword(email: string) {

    //     const expiresAt = new Date(Date.now() + 300000)
    //     const currentTimestamp = new Date();

    //     const user = await this.userCredentialsRepository.findOne({
    //         where: { email },
    //     });
    //     console.log("user", user);

    //     if (!user) {
    //         // console.log("hiii")
    //         return new HttpException('Email not found', 404);
    //     }
    //     else {

    //         const otp = this.generateOTP();
    //         console.log("otp", otp)
    //         await this.mailService.sendOTPEmail(email, otp);
    //         // const saveOtp = await this.userOtp.save({})
    //         const employeeId = await this.employeeRepository.findOne({
    //             where: {
    //                 email
    //             }
    //         });
    //         console.log("employee", employeeId.id)
    //         const isOtpAlreadySent = await this.userOtp.findOne({
    //             where: {
    //                 employeeId: { id: employeeId?.id }
    //             }
    //         });

    //         console.log("isOtpAlreadySent...", isOtpAlreadySent);

    //         if (isOtpAlreadySent) {
    //             await this.userOtp.save({
    //                 ...isOtpAlreadySent,
    //                 otpCode: otp,
    //                 createdAt: currentTimestamp,
    //                 expiresAt
    //             }
    //             )
    //             console.log("isOtpAlreadySent...", isOtpAlreadySent);
    //         }
    //         else {
    //             await this.userOtp.save({
    //                 otpCode: otp,
    //                 employeeId,
    //                 expiresAt

    //             })
    //             console.log("otpCode", otp)
    //         }
    //         return { message: 'OTP sent to your email address' };
    //     }

    // }


    // async resetPasswordWithOTP(email: string, otp: string, newPassword: string, confirmPassword: string) {
    //     const user = await this.userCredentialsRepository.findOneBy({ email });
    //     if (!user) {
    //         throw new HttpException('Invalid email address', 400);
    //     }

    //     const employee = await this.employeeRepository.findOneBy({ email })
    //     if (!employee) {
    //         throw new HttpException("Invalid email address", 400)
    //     }

    //     const savedOTPRecord = await this.userOtp.findOne({ where: { employeeId: { id: employee.id } } });

    //     if (!savedOTPRecord || savedOTPRecord.otpCode !== otp) {
    //         throw new HttpException('Invalid OTP', 400);
    //     }
    //     console.log("savedOTPRecordOtppppp", otp)

    //     if (new Date() > savedOTPRecord.expiresAt) {
    //         throw new HttpException('OTP has expired', 400);
    //     }

    //     if (!newPassword || newPassword.length < 6) {
    //         throw new HttpException('Password must be at least 6 characters long', 400);
    //     }

    //     if (newPassword !== confirmPassword) {
    //         throw new HttpException('Passwords do not match', 400);
    //     }

    //     const encryptedPassword = this.encrypt(newPassword);

    //     await this.userCredentialsRepository.update({ email }, { password: encryptedPassword });

    //     await this.mailService.sendPasswordResetEmail(email)

    // }




// async hashPassword(password: string): Promise<string> {
//     const saltOrRounds = 10;
//     return bcrypt.hash(password, saltOrRounds);
// }

// async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
//     console.log("plainPassword:", plainPassword);
// //    console.log("hashedPassword:", hashedPassword(plainPassword));
// const hashedPassword1 =await this.hashPassword(plainPassword);
// console.log("hashedPassword1...",hashedPassword1);


//     return bcrypt.compare(plainPassword, hashedPassword);
// }


