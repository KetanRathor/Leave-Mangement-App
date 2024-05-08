import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from "@nestjs/passport";
import {Profile, Strategy} from 'passport-google-oauth20';
import { AuthService } from "./auth.service";
import { use } from "passport";
import * as dotenv from 'dotenv';
import { VerifiedCallback } from "passport-jwt";

  
  dotenv.config();
Injectable
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(
        private jwtService: JwtService,
        // private authService:AuthService
        @Inject('AUTH_SERVICE') private readonly authService:AuthService
    ){
        super({
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:'http://localhost:4001/auth/google/redirect',
            scope:['openid','profile','email'],
            
            
                
        });
    }

    // async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) {

    //     const domain = profile.emails[0].value.split('@')[1];

    // if (domain !== process.env.DOMAIN_NAME) { 
    //     throw new Error('Unauthorized domain');
    // }
        
    //     console.log("accessToken...",accessToken);
    //     console.log("refreshToken...",refreshToken);
    //     console.log("profile...",profile);
    //     // const token = await this.jwtService.sign(accessToken); 
    //     // console.log("token...",token)
    //     // return token;
    //     const {name, emails, photos } = profile;
    //     const user =await this.authService.validateUserGoogle({
    //         email:emails[0].value,
    //         name:profile.displayName,
    //         // picture:photos[0].value,
            
            
    //     })
    //     done(null,user);
    //     // const user = await this.authService.validateUserGoogle({
    //     //     email:profile.emails[0].value,
    //     //     displayName:profile.displayName,
    //     // });
    //     // console.log('Validate');
    //     // console.log(user);
    //     // return {user,accessToken};
    // }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) {
        try {
            const domain = profile.emails[0].value.split('@')[1];
    
            if (domain !== process.env.DOMAIN_NAME) { 
                throw new Error('Unauthorized domain');
            }
            const idToken = profile.id;

            console.log("accessToken...", accessToken);
            console.log("refreshToken...", refreshToken);
            console.log("profile...", profile);
    
            const { name, emails, photos } = profile;
            const user = await this.authService.validateUserGoogle({
                email: emails[0].value,
                name: profile.displayName,
                // Add any other user information you need
            });
            done(null, { accessToken, user ,idToken:idToken});
        } catch (error) {
            done(error, false);
        }
    }
}
