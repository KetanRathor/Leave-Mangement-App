import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from "@nestjs/passport";
import {Profile, Strategy} from 'passport-google-oauth20';
import { AuthService } from "./auth.service";
import { use } from "passport";
Injectable
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(
        private jwtService: JwtService,
        // private authService:AuthService
        @Inject('AUTH_SERVICE') private readonly authService:AuthService
    ){
        super({
            clientID:'172003958744-fkpu8re3qrsud7v51jr4g209pu8a6esd.apps.googleusercontent.com',
            clientSecret:'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',
            callbackURL:'http://localhost:4001/auth/google/redirect',
            scope:['profile','email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        // const payload = { accessToken, profile };
        console.log("accessToken...",accessToken);
        console.log("refreshToken...",refreshToken);
        console.log("profile...",profile);
        // const token = await this.jwtService.sign(accessToken); 
        // console.log("token...",token)
        // return token;
        const user = await this.authService.validateUserGoogle({
            email:profile.emails[0].value,
            displayName:profile.displayName,
        });
        console.log('Validate');
        console.log(user);
        return {user,accessToken};
    }
}
