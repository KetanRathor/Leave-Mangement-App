import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from './entities/UserCredentials.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import * as dotenv from 'dotenv';
import { MailService } from 'src/mail/mail.service';
// import { MailService } from 'src/mail/mail.service';
import * as cache from 'memory-cache';



dotenv.config();

@Injectable()
export class AuthService {

    
    private readonly iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
    private readonly otpTTL = 300000;
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserCredentials)
        private readonly userCredentialsRepository: Repository<UserCredentials>,
        private readonly mailService  : MailService
    ) { }


    
    

    encrypt(text: string): string {
        console.log("tets",text)
        const cipher = crypto.createCipheriv(process.env.ALGORITHM, process.env.ENCRYPTION_KEY, this.iv);
        console.log("key", process.env.ENCRYPTION_KEY)
        let encrypted =  cipher.update(text, 'utf8', 'hex');
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
            if (!user) return new HttpException('Username incorrect ',403);
            const decryptedStoredPassword = this.decrypt(user.password);
            console.log("decryptedStoredPassword",decryptedStoredPassword) 
                if (password === decryptedStoredPassword) {
            const { password, ...userdata } = user;
            console.log("password",password);
            const token = await this.jwtService.signAsync(userdata);
            return {access_token : token}

              
        }
        else return new HttpException('Password incorrect ',403)
        
        } catch (error) {
            console.log("error", error)
        }

      
    }

    async registerUser( email : string) {
        const generatedPassword = this.generateRandomPassword(10); 
        const encryptedPassword = this.encrypt(generatedPassword); 

        const newUser = this.userCredentialsRepository.create({
            email,
            password: encryptedPassword, 
        });

        await this.userCredentialsRepository.save(newUser);

        return  generatedPassword ;
    }

    generateRandomPassword(length: number): string {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        console.log("password",password)
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

    
      async forgotPassword(email: string) {
        const user = await this.userCredentialsRepository.findOne({
          where: { email },
        });
    
        if (!user) {
          return new HttpException('Email not found', 404);
        }
    
        const otp = this.generateOTP();
        await this.mailService.sendOTPEmail(email, otp);
    
        return { message: 'OTP sent to your email address' };
      }

      async resetPasswordWithOTP(email: string, otp: string, newPassword: string, confirmPassword: string){
            cache.put(email, otp,this.otpTTL);
            const cachedOTP =cache.get(email);
            console.log('Cached OTP:', cachedOTP)
            if (!cachedOTP || cachedOTP !== otp) {
                throw new HttpException('Invalid OTP', 400);
            }
            if (!newPassword || newPassword.length < 6) {
                throw new HttpException('Password must be at least 6 characters long', 400);
            }
        
            // Validate password confirmation
            if (newPassword !== confirmPassword) {
                throw new HttpException('Passwords do not match', 400);
            }
            
            const encryptedPassword = this.encrypt(newPassword);

            // Update password in database
            await this.userCredentialsRepository.update({ email }, { password: encryptedPassword });

            await this.mailService.sendPasswordResetEmail(email)
            // Remove OTP from cache after successful password reset
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