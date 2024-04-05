import { Injectable } from '@nestjs/common';
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
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserCredentials)
        private readonly userCredentialsRepository: Repository<UserCredentials>
    ) { }


    private readonly algorithm = 'aes-256-cbc'; // AES encryption algorithm
    private readonly key = crypto.randomBytes(32); // Generate a random key (256 bits = 32 bytes)
    private readonly iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector) for CBC mode

     encrypt(text: string): string {
        console.log("tets",text)
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted =  cipher.update(text, 'utf8', 'hex');
        console.log("first", encrypted);
        encrypted += cipher.final('hex');
        console.log("finalenc", encrypted);
        return encrypted;
    }

    decrypt(encryptedText: string): string {
        console.log("Tesxttttt",encryptedText)
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        console.log("decrypted : ", decrypted);
        return decrypted;
    }



    async validateUser({ email, password }: AuthPayloadDto) {
        console.log("Inside Validate User...");
        // const encryptedValue = this.encrypt("tvsdhsgdvfhs")
        // this.decrypt(this.encrypt("tvsdhsgdvfhs"))

        

        const user = await this.userCredentialsRepository.findOne({
            where: { email }
        })

        console.log("user...", user);

        if (!user) return null;

        // const isPasswordValid = await this.comparePasswords(password, user.password);

        // const decryptedPassword = this.decrypt(user.password);


        // if(isPasswordValid){
        // if (password === decryptedPassword) {
            if(password === user.password){
            const { password, ...userdata } = user;
            const token = await this.jwtService.signAsync(userdata);
            return {access_token : token}
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