import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from './entities/UserCredentials.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import * as dotenv from 'dotenv';


dotenv.config();

@Injectable()
export class AuthService {

    
    private readonly iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserCredentials)
        private readonly userCredentialsRepository: Repository<UserCredentials>
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
        console.log("Tesxttttt",encryptedText)
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
            // if(password === user.password){  
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

    async registerUser({ email }: AuthPayloadDto) {
        const generatedPassword = this.generateRandomPassword(10); 
        const encryptedPassword = this.encrypt(generatedPassword); 

        const newUser = this.userCredentialsRepository.create({
            email,
            password: encryptedPassword, 
        });

        await this.userCredentialsRepository.save(newUser);

        return { message: 'User registered successfully', password: generatedPassword };
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