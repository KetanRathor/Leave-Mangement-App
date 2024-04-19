import { HttpException, HttpStatus, Injectable, Post, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from './entities/UserCredentials.entity';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import * as dotenv from 'dotenv';
import { MailService } from 'src/mail/mail.service';
// import { MailService } from 'src/mail/mail.service';
import * as cache from 'memory-cache';
import { Employee } from 'src/employee/entities/Employee.entity';



dotenv.config();

@Injectable()
export class AuthService {


    private readonly iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
    private readonly otpTTL = 300000;
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserCredentials)
        private readonly userCredentialsRepository: Repository<UserCredentials>,
        // private readonly employeeRepository: Repository<Employee>,
        private readonly mailService: MailService
    ) { }





    encrypt(text: string): string {
        console.log("tets", text)
        const cipher = crypto.createCipheriv(process.env.ALGORITHM, process.env.ENCRYPTION_KEY, this.iv);
        console.log("key", process.env.ENCRYPTION_KEY)
        let encrypted = cipher.update(text, 'utf8', 'hex');
        console.log("first", encrypted);
        encrypted += cipher.final('hex');
        console.log("finalenc", encrypted);
        return encrypted;
    }

    decrypt(encryptedText: string): string {
        // console.log("Tesxttttt",encryptedText)
        // console.log("Key", this.key );

        console.log("key dec", process.env.ENCRYPTION_KEY)
        const decipher = crypto.createDecipheriv(process.env.ALGORITHM, process.env.ENCRYPTION_KEY, this.iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        console.log("decrypted : ", decrypted);


        return decrypted;
    }





    async validateUser({ email, password }: AuthPayloadDto) {
        console.log("Inside Validate User...");

        const user = await this.userCredentialsRepository.findOne({
            where: { email }
        })
        console.log("user...", user);

        try {
            if (!user) return new HttpException('Username incorrect ', 403);
            const decryptedStoredPassword = this.decrypt(user.password);
            console.log("decryptedStoredPassword", decryptedStoredPassword)
            if (password === decryptedStoredPassword) {

                const { password, ...userdata } = user;
                console.log("password", password);
                const token = await this.jwtService.signAsync(userdata);
                return { access_token: token }
            }
            else return new HttpException('Password incorrect ', 404)

        } catch (error) {
            console.log("error", error)
        }
    }

    // async validateUser({ email, password }: AuthPayloadDto) {
    //     // ... existing authentication logic ...
      
    //     if (password === decryptedStoredPassword) {
    //       const profile = await this.employeeService.showProfile(user.id); // Call showProfile to get role
    //       if (!profile) {
    //         // Handle case where user not found
    //         return new HttpException('User not found', 404);
    //       }
      
    //       const token = await this.jwtService.signAsync(profile);
    //       return { access_token: token, role: profile.role };
    //     }
    //     // ...
    //   }

    // async deriveUserRole(userId: number): Promise<string> {
        
    //     const managerIDs = await this.employeeRepository.find({
    //         where: { deleted_at: IsNull() },
    //         select: ['manager_id'],
    //     });
    
    //     const employee = await this.employeeRepository.findOne({
    //         where: { id: userId, deleted_at: IsNull() },
    //     });
    
    //     if (employee) {
    //         if (employee.admin) {
    //             return 'Admin';
    //         } else if (managerIDs.some(manager => manager.manager_id === userId)) {
    //             return 'Manager';
    //         } else {
    //             return 'Employee';
    //         }
    //     } else {
    //         return null;
    //     }
    // }

    async registerUser(email: string) {
        const generatedPassword = this.generateRandomPassword(10);
        const encryptedPassword = this.encrypt(generatedPassword);

        const newUser = this.userCredentialsRepository.create({
            email,
            password: encryptedPassword,
        });

        await this.userCredentialsRepository.save(newUser);

        return generatedPassword;
    }

    generateRandomPassword(length: number): string {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        console.log("password", password)
        return password;

    }

    generateOTP() {
        const digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * digits.length);
            OTP += digits[randomIndex];
        }
        return OTP;
    }


    //   async forgotPassword(email: string) {
    //     const user = await this.userCredentialsRepository.findOne({
    //       where: { email },
    //     });
    //     console.log("user",user);
    //     if (!user) {
    //         const otp = this.generateOTP();
    //         await this.mailService.sendOTPEmail(email, otp);


    //         return { message: 'OTP sent to your email address' };

    //             //   return new HttpException('Email not found', 404);
    //             }
    //             else{
    //          return { message: 'Email not found' };


    //     }

    //   }


    async forgotPassword(email: string) {
        const user = await this.userCredentialsRepository.findOne({
            where: { email },
        });
        console.log("user", user);

        if (!user) {
            // return { message: 'Email not found' };
            console.log("hiii")
            return new HttpException('Email not found', 404);
        }
        else {

            const otp = this.generateOTP();
            await this.mailService.sendOTPEmail(email, otp);


            return { message: 'OTP sent to your email address' };
        }

    }

    async resetPasswordWithOTP(email: string, otp: string, newPassword: string, confirmPassword: string) {
        const user = await this.userCredentialsRepository.findOneBy({ email }); 
        if (!user) {
        throw new HttpException('Invalid email address', 400);
  }
        cache.put(email, otp, this.otpTTL);
        const cachedOTP = cache.get(email);
        console.log('Cached OTP:', cachedOTP)
        if (!cachedOTP || cachedOTP !== otp) {
            throw new HttpException('Invalid OTP', 400);
        }
        if (!newPassword || newPassword.length < 6) {
            throw new HttpException('Password must be at least 6 characters long', 400);
        }


        if (newPassword !== confirmPassword) {
            throw new HttpException('Passwords do not match', 400);
        }

        const encryptedPassword = this.encrypt(newPassword);


        await this.userCredentialsRepository.update({ email }, { password: encryptedPassword });

        await this.mailService.sendPasswordResetEmail(email)

        cache.del(email);
    }









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


}