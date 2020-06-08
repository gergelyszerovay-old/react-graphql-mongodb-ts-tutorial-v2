import {Field, InputType} from "type-graphql"; // @SERVER
import {IsHexadecimal, IsString, Length, MaxLength} from "class-validator";

@InputType() // @SERVER
export class EditNoteInput {
    @Field(() => String) // @SERVER
    @IsString()
    @IsHexadecimal()
    @Length(24)
    _id!: string;

    @Field(() => String) // @SERVER
    @IsString()
    @MaxLength(128)
    title!: string;

    @Field(() => String) // @SERVER
    @IsString()
    @MaxLength(10000)
    text!: string;

    @Field(() => String) // @SERVER
    tagIds!: string[];
}