import {Field, InputType} from "type-graphql"; // @SERVER
import {IsString, MaxLength} from "class-validator";

@InputType() // @SERVER
export class NewNoteInput {
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