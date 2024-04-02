import { Body, Controller, HttpException, Post, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './guards/local.guard';
// import { Request } from 'express';
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    @Post('login')
    // @UseGuards(LocalGuard)
    login(@Body() authPayload:AuthPayloadDto){
        console.log("Inside controller...");
        
        const user= this.authService.validateUser(authPayload);
       
        // if(!user)throw new HttpException("Invalid Credentials", 401);
        return user;
}
}