import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { UserCredentials } from "../entities/UserCredentials.entity";
@Injectable()
export class SessionSerializer extends PassportSerializer{
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService:AuthService
    ){
        super();
    }
    serializeUser(user: UserCredentials, done: Function) {
        console.log('Serialize User');
        done(null, user);
    }
    async deserializeUser(payload: any, done: Function) {
        const user = this.authService.findUser(payload.id);
        console.log('Deserialize User');
        return user? done(null,user):done(null,null);
    }
}