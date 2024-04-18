import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description:'email of employee'
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description:'otp for verification'
    })
    otp: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @ApiProperty({
        description:'new password of employee'
    })
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, { message: 'Password too weak' })
    @ApiProperty({
        description:'confirm new password of employee'
    })
    confirmPassword: string;
}