import {Field, InputType} from "type-graphql"; // @SERVER
import {IsString, MaxLength, MinLength} from "class-validator";

@InputType() // @SERVER
export class NewNoteInput {
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
