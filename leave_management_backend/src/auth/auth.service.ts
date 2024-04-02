import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from './entities/UserCredentials.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserCredentials)
        private readonly userCredentialsRepository: Repository<UserCredentials>
    ) { }

    async validateUser({ email, password }: AuthPayloadDto) {
        console.log("Inside Validate User...");
        const findUser = await this.userCredentialsRepository.findOne({
            where: { email }
        })

        console.log("user...",findUser);

        if(!findUser) return null;

        const isPasswordValid = await this.comparePasswords(password, findUser.password);

        if(isPasswordValid){
        // if(password === findUser.password){
            const {password, ...user} = findUser;
            return await this.jwtService.signAsync(user);
        } 

    }
    // async hashPassword(password: string): Promise<string> {
    //     const saltRounds = 10;
    //     return bcrypt.hash(password, saltRounds);
    // }

    // async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    //     console.log("plainPassword:", plainPassword);
    //     console.log("hashedPassword:", hashedPassword);

    //     return bcrypt.compare(plainPassword, hashedPassword);
    // }

    async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return bcrypt.hash(password, saltOrRounds);
    }

    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        console.log("plainPassword:", plainPassword);
    //    console.log("hashedPassword:", hashedPassword(plainPassword));
    const hashedPassword1 =await this.hashPassword(plainPassword);
    console.log("hashedPassword1...",hashedPassword1);
    

        return bcrypt.compare(plainPassword, hashedPassword);
    }


}