import { IsNotEmpty, IsString, Matches } from "class-validator";

export class DeleteNoteDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9a-fA-F]{24}$/, { message: 'note id is not valid for id pattern' })
    public id:string;
}