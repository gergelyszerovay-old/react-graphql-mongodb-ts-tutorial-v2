import {Field, InputType} from "type-graphql"; // @SERVER
import {IsHexadecimal, IsString, Length, MaxLength, MinLength} from "class-validator";

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
    @MinLength(1)
    title!: string;

    @Field(() => String) // @SERVER
    @IsString()
    @MaxLength(10000)
    text!: string;

    @Field(() => [String]) // @SERVER
    tagIds!: string[];
}
