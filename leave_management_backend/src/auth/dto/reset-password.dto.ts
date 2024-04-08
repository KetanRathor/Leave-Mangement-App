import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    otp: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, { message: 'Password too weak' })
    confirmPassword: string;
}