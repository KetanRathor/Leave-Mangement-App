import { Controller, Get, HttpStatus, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './guards/auth.guard';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './GoogleStrategy';


async function refreshAccessToken(refreshToken: string){
  
}
@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly authService:AuthService,
   
  
){
  
}
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleAuth(@Req() req) {} 
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req)
  }


  @Get('status')
  async user(@Req() request:Request){
    console.log(request.user);
    if(request.user){
        return {msg:'Authenticated'};

    }
    else{
        return{msg:'Not AUthenticated'}
    }
  }

  @Post('refresh-token')
  async refreshToken(@Req() req, @Res() res) {
    try {
      const { refreshToken } = req.body;
      const newAccessToken = await refreshAccessToken(refreshToken);
            res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
    }
  }
}












  // @Get('google/redirect')
  // @UseGuards(GoogleAuthGuard)
  // googleAuthRedirect(@Req() req) {
  //   try {
  //     if (req.user) {
  //       const accessToken = req.user.accessToken;
  
  //       return { message: 'Success', accessToken };
  //     } else {
  //       return { message: 'Failure' };
  //     }
  //   } catch (error) {
  //     if (error.message === 'Unauthorized domain') {
  //       return { message: 'Login restricted to specific domain' };
  //     }
  //     throw error;
  //   }
  // }

  






// import { AuthService } from './auth.service';
// import { AuthPayloadDto } from './dto/auth.dto';
// import { AuthGuard } from './guards/auth.guard';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import {
//     Body,
//     Controller,
//     Get,
//     HttpCode,
//     HttpException,
//     HttpStatus,
//     Param,
//     Post,
//     Req,
//     Request,
//     Res,
//     UseGuards
// } from '@nestjs/common';
// import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

// @ApiTags('Authentication')
// @Controller('auth')
// export class AuthController {

//     constructor(private readonly authService: AuthService) { }

//     @HttpCode(HttpStatus.OK)
//     @Post('login')
//     @ApiCreatedResponse({
//         description:'Get Authentication Token'
//     })
//     login(@Body() authPayload: AuthPayloadDto) {
//         const token = this.authService.validateUser(authPayload);
//         if (!token) throw new HttpException('Invalid Credentials', 401);
//         return token;
//     }

    
// @Post('forgotpassword')
// async forgotPassword(@Body('email') email: string) {
//     try {
//         const result = await this.authService.forgotPassword(email);
//         return result;
//     } catch (error) {
        
//         return { error: error.message };
//     }
// }

// @Post('reset-password')
//     async resetPasswordWithOTP(@Body() resetPasswordDto: ResetPasswordDto) {
//         try {
//             const { email, otp, newPassword, confirmPassword } = resetPasswordDto;
//             await this.authService.resetPasswordWithOTP(email, otp, newPassword, confirmPassword);
//             return { message: 'Password reset successfully' };
//         } catch (error) {
//             return { error: error.message };
//         }
//     }

// // @Post('reset-password')
// // async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
// //     try {
// //         await this.authService.resetPassword(resetPasswordDto.email, resetPasswordDto.newPassword, resetPasswordDto.confirmPassword);
// //         return { message: 'Password reset successfully' };
// //     } catch (error) {
// //         return { error: error.message };
// //     }
// // }

// // @Post('verify-otp')
// // async verifyOTP(@Body() resetPasswordDto: ResetPasswordDto) {
// //     try {
// //         await this.authService.verifyOTP(resetPasswordDto.email, resetPasswordDto.otp);
// //         return { message: 'OTP verified successfully' };
// //     } catch (error) {
// //         return { error: error.message };
// //     }
// // }
// @Get('google')
//   @UseGuards(new AuthGuard('google'))
//   googleAuth() {} // Passport handles the Google authentication

//   @Get('google/callback')
//   @UseGuards(new AuthGuard('google/callback'))
//   googleAuthRedirect(@Req() req) {
//     // After successful authentication, handle redirection or response
//     // You can access user profile through req.user
//     return req.user ? { message: 'Success' } : { message: 'Failure' };
//   }
    



// }

// auth.controller.ts

