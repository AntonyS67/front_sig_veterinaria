import { User } from "./user";

export interface AuthResponse{
    isSuccess:boolean,
    user:User,
    token:string
}
