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
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiCreatedResponse({
        description:'Get Authentication Token'
    })
    login(@Body() authPayload: AuthPayloadDto) {
        const token = this.authService.validateUser(authPayload);
        if (!token) throw new HttpException('Invalid Credentials', 401);
        return token;
    }

    
@Post('forgotpassword')
@ApiCreatedResponse({
    description:'get otp on given mail',
})
@ApiBody({
    schema: {
        type: 'object',
        properties: {
            email: { type: 'string' }
        },}
})
async forgotPassword(@Body('email') email: string) {
    try {
        const result = await this.authService.forgotPassword(email);
        return result;
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

// @Post('reset-password')
// async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
//     try {
//         await this.authService.resetPassword(resetPasswordDto.email, resetPasswordDto.newPassword, resetPasswordDto.confirmPassword);
//         return { message: 'Password reset successfully' };
//     } catch (error) {
//         return { error: error.message };
//     }
// }

// @Post('verify-otp')
// async verifyOTP(@Body() resetPasswordDto: ResetPasswordDto) {
//     try {
//         await this.authService.verifyOTP(resetPasswordDto.email, resetPasswordDto.otp);
//         return { message: 'OTP verified successfully' };
//     } catch (error) {
//         return { error: error.message };
//     }
// }


    



}