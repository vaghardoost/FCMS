import { IsNotEmpty, IsString, Matches } from "class-validator";

export class DeleteNoteDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9a-fA-F]{24}$/)
    public id:string;
}