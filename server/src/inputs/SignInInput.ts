import {Field, InputType} from "type-graphql"; // @SERVER
import {IsEmail, IsString, MaxLength, MinLength, ValidationArguments} from "class-validator";

// import {ValidationOptions} from "class-validator";


@InputType() // @SERVER
export class SignInInput {
    @Field() // @SERVER
    @IsString()
    @MaxLength(128)
    @IsEmail()
    email!: string;

    @Field() // @SERVER
    @IsString()
    @MaxLength(32)
    @MinLength(8, {
        message: (args: ValidationArguments) => {
            return "Password is too short, minimum length is " + args.constraints[0] + " characters";
        }
    })
    password!: string;
}