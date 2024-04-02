import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from 'src/employee/entities/UserCredentials.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private jwtService:JwtService,
        @InjectRepository(UserCredentials)
        private readonly userCredentialsRepository: Repository<UserCredentials>
    ){}



    async validateUser({email, password}:AuthPayloadDto){
        // console.log()
        const findUser = await this.userCredentialsRepository.findOne({
            where:{email}
        })
        console.log("findUser ",findUser);
        

        if(!findUser)
        return null;
        
        if(password === findUser.password){
            const {password, ...user} = findUser;
            return this.jwtService.sign(user)

        }
    }
}
