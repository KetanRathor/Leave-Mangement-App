import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from './entities/UserCredentials.entity';
import { Repository } from 'typeorm';

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

        if(password === findUser.password){
            const {password, ...user} = findUser;
            return await this.jwtService.signAsync(user);
        } 
    }
}