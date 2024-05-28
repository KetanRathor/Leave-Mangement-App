import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { UserDetails } from "./types";
import { Employee } from "src/employee/entities/Employee.entity";
@Injectable()
export class SessionSerializer extends PassportSerializer{
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService:AuthService
    ){
        super();
    }
    serializeUser(user: Employee, done: Function) {
        console.log('Serialize User');
        done(null, user);
    }
    async deserializeUser(payload: any, done: Function) {
        const user = await this.authService.findUser(payload.id);
        console.log('Deserialize User',user);
        return user? done(null,user):done(null,null);
    }
}