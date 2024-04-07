// import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
// import { Request } from 'express';
import { AuthPayloadDto } from './dto/auth.dto';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from './guards/auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
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

// @ApiTags('auth')
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
@Post('forgotpassword')
async forgotPassword(@Body('email') email: string) {
    try {
        await this.authService.forgotPassword(email);
        return { message: 'OTP sent to your email address' };
    } catch (error) {
        
        return { error: error.message };
    }
}

@Post('reset-password')
    async resetPasswordWithOTP(@Body() resetPasswordDto: ResetPasswordDto) {
        try {
            const { email, otp, newPassword, confirmPassword } = resetPasswordDto;
            await this.authService.resetPasswordWithOTP(email, otp, newPassword, confirmPassword);
            return { message: 'Password reset successfully' };
        } catch (error) {
            return { error: error.message };
        }
    }


}