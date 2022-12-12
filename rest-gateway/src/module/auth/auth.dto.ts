import { IsString } from "class-validator";

export class AuthDto {
    @IsString()
    public username:string;

    @IsString()
    public password:string;
}