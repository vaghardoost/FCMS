import { IsNotEmpty, IsString } from "class-validator";

export class DeleteCatDto {
    @IsString()
    @IsNotEmpty()
    public id:string;
}