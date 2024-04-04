import { AuthService } from './auth.service';
// import { Request } from 'express';
import { AuthPayloadDto } from './dto/auth.dto';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from './guards/auth.guard';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() authPayload: AuthPayloadDto) {
        const token = this.authService.validateUser(authPayload);
        if (!token) throw new HttpException('Invalid Credentials', 401);
        return token;
    }

    
    // @UseGuards(AuthGuard)
    // @Get('profile')
    // getProfile(@Request() req){
    //     return req.user;
    // }

//     @UseGuards(AuthGuard)
//     @Get('EmployeeList')
//   showEmployeeList(@Request() req) {
//     return req.user;
//   }

}