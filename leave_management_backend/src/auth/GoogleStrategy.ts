// import { Inject, Injectable } from "@nestjs/common";
// import { JwtService } from '@nestjs/jwt';
// import { PassportStrategy } from "@nestjs/passport";
// import {Profile, Strategy} from 'passport-google-oauth20';
// import { AuthService } from "./auth.service";
// import { use } from "passport";
// import * as dotenv from 'dotenv';
// import { VerifiedCallback } from "passport-jwt";

  
//   dotenv.config();
// Injectable
// export class GoogleStrategy extends PassportStrategy(Strategy){
//     constructor(
//         private jwtService: JwtService,
//         // private authService:AuthService
//         @Inject('AUTH_SERVICE') private readonly authService:AuthService
//     ){
//         super({
//             clientID:process.env.GOOGLE_CLIENT_ID,
//             clientSecret:process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL:'http://localhost:4001/auth/google/redirect',
//             scope:['openid','profile','email'],
            
            
                
//         });
//     }

//     // async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) {

//     //     const domain = profile.emails[0].value.split('@')[1];

//     // if (domain !== process.env.DOMAIN_NAME) { 
//     //     throw new Error('Unauthorized domain');
//     // }
        
//     //     console.log("accessToken...",accessToken);
//     //     console.log("refreshToken...",refreshToken);
//     //     console.log("profile...",profile);
//     //     // const token = await this.jwtService.sign(accessToken); 
//     //     // console.log("token...",token)
//     //     // return token;
//     //     const {name, emails, photos } = profile;
//     //     const user =await this.authService.validateUserGoogle({
//     //         email:emails[0].value,
//     //         name:profile.displayName,
//     //         // picture:photos[0].value,
            
            
//     //     })
//     //     done(null,user);
//     //     // const user = await this.authService.validateUserGoogle({
//     //     //     email:profile.emails[0].value,
//     //     //     displayName:profile.displayName,
//     //     // });
//     //     // console.log('Validate');
//     //     // console.log(user);
//     //     // return {user,accessToken};
//     // }

//     async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) {
//         try {
//             const domain = profile.emails[0].value.split('@')[1];
    
//             if (domain !== process.env.DOMAIN_NAME) { 
//                 throw new Error('Unauthorized domain');
//             }
//             const idToken = profile.id;

//             console.log("accessToken...", accessToken);
//             console.log("refreshToken...", refreshToken);
//             console.log("profile...", profile);
    
//             const { name, emails, photos } = profile;
//             const user = await this.authService.validateUserGoogle({
//                 email: emails[0].value,
//                 name: profile.displayName,
//                 // Add any other user information you need
//             });
//             done(null, { accessToken, user ,idToken:idToken});
//         } catch (error) {
//             done(error, false);
//         }
//     }
// }



import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from "./auth.service";
import { use } from "passport";
import * as dotenv from 'dotenv';
import { VerifiedCallback } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Employee } from "src/employee/entities/Employee.entity";
import { Repository } from "typeorm";

dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
    private jwtService: JwtService,
    @Inject('AUTH_SERVICE') private readonly authService: AuthService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4001/auth/google/redirect',
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) {
    try {
    //   const domain = profile.emails[0].value.split('@')[1];

    //   if (domain !== process.env.DOMAIN_NAME) {
    //     throw new Error('Unauthorized domain');
    //   }



      const idToken = profile.id; 

      const { name, emails, photos } = profile;
      const user = await this.authService.validateUserGoogle({
        email: emails[0].value,
        name: profile.displayName,
        
        
      });

      if (!user) {
        return done(new Error('User not found'), null);
      }

    //   const { deleted_at } = await this.employeeRepository.findOne({
    //     where: { id: user.id, deleted_at: null },
    //   });
    // if (deleted_at !== null) {
    //   return done(new Error('User is deleted'), null);
    // }

      const { role, ...userDetails } = await this.authService.showProfile(user.id);
      const userForToken = {
        id: user.id, 
        email: emails[0].value,
        name,
        role,
        
      };

      const payload = { user: userForToken };
      const jwtToken = await this.jwtService.sign(payload); 

      return done(null, { 
        accessToken, 
        // user,
        //  idToken: idToken,
          jwtToken
         }); 
    } catch (error) {
      return done(error, false);
    }
  }
}





// import { Injectable, Inject } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy, Profile } from 'passport-google-oauth20';
// import { AuthService } from "./auth.service";
// import { JwtService } from '@nestjs/jwt';
// import { VerifiedCallback } from "passport-jwt";
// import * as dotenv from 'dotenv';
// import { OAuth2Client } from 'google-auth-library';

// dotenv.config();

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy) {
//     private readonly client: OAuth2Client;

//     constructor(
//         private jwtService: JwtService,
//         @Inject('AUTH_SERVICE') private readonly authService: AuthService
//     ) {
//         super({
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: 'http://localhost:4001/auth/google/redirect',
//             scope: ['openid', 'profile', 'email'],
//         });
//         this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//     }

//     async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) {
//         try {
            
//             const userDetails = await this.verifyToken(accessToken);

            
//             const domain = profile.emails[0].value.split('@')[1];
//             if (domain !== process.env.DOMAIN_NAME) {
//                 throw new Error('Unauthorized domain');
//             }

            
//             const { name, emails, photos } = profile;

            
//             const user = await this.authService.validateUserGoogle({
//                 email: emails[0].value,
//                 name: profile.displayName,
                
//             });

//             // Call done to indicate successful validation and return user details
//             done(null, { accessToken, user, userDetails });

//         } catch (error) {
//             // Handle errors during validation
//             done(error, false);
//         }
//     }

//     async verifyToken(token: string) {
//         try {
//             const ticket = await this.client.verifyIdToken({
//                 idToken: token,
//                 audience: process.env.GOOGLE_CLIENT_ID,
//             });
//             const payload = ticket.getPayload();
//             return payload;
//         } catch (error) {
//             console.error('Error verifying token:', error);
//             throw new Error('Token verification failed');
//         }
//     }
// }

