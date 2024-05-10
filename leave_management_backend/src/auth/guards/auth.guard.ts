// import {
//     CanActivate,
//     ExecutionContext,
//     Injectable,
//     UnauthorizedException,
//   } from '@nestjs/common';
//   import { JwtService } from '@nestjs/jwt';
//   import { Request } from 'express';
//   import * as dotenv from 'dotenv';

  
//   dotenv.config();
//   @Injectable()
//   export class AuthGuard implements CanActivate {
//     constructor(private jwtService: JwtService) {}
  
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//       const request = context.switchToHttp().getRequest();
//       const token = this.extractTokenFromHeader(request);
//       if (!token) {
//         throw new UnauthorizedException();
//       }
//       try {
//         const payload = await this.jwtService.verifyAsync(
//           token,
//           {
            
//             secret : process.env.SECRET,
           
//           }
//         );
       
        
//         request['user'] = payload;
//       } catch {
//         throw new UnauthorizedException();
//       }
//       return true;
//     }
  
//     private extractTokenFromHeader(request: Request): string | undefined {
//       const [type, token] = request.headers.authorization?.split(' ') ?? [];
//       return type === 'Bearer' ? token : undefined;
//     }
//   }

import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class GoogleAuthGuard extends AuthGuard('google'){
  async canActivate(context: ExecutionContext){
    const activate = (await super.canActivate(context))as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return activate;
  }
}
  
// import { ExecutionContext, UnauthorizedException, Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// // Import JwtService if using JWT verification
// import { JwtService } from '@nestjs/jwt'; // Optional
// import { Request } from 'express';

// @Injectable()
// export class GoogleAuthGuard extends AuthGuard('google') {
  
//   constructor(private readonly jwtService?: JwtService) {
//     super();
//   } // Optional dependency injection

//   async canActivate(context: ExecutionContext): Promise<boolean> {
    
//     const request = context.switchToHttp().getRequest<Request>();

    
//     const activate = (await super.canActivate(context)) as boolean;
//     if (!activate) {
//       throw new UnauthorizedException('Google authentication failed');
//     }

//     // 2. (Optional) JWT Verification
//     if (this.jwtService) { 
//       const token = this.extractTokenFromHeader(request);
//       if (!token) {
//         throw new UnauthorizedException('Missing JWT token');
//       }
//       try {
//         const payload = await this.jwtService.verifyAsync(token, {
//           secret: process.env.SECRET, 
//         });
//         request['user'] = payload; 
//       } catch (error) {
//         throw new UnauthorizedException('Invalid JWT token'); 
//       }
//     }
    

//     return true; 
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers?.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }
