import {Field, InputType} from "type-graphql"; // @SERVER
import {
    IsEmail,
    IsString,
    MaxLength,
    MinLength,
    registerDecorator,
    ValidationArguments,
    ValidationOptions
} from "class-validator";

function EqualsWith(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isLongerThan",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return typeof value === "string" &&
                        typeof relatedValue === "string" &&
                        value === relatedValue
                }
            }
        });
    };
}

@InputType() // @SERVER
export class SignUpInput {
    @Field() // @SERVER
    @IsString()
    @MaxLength(128)
    @IsEmail()
    email!: string;

    @Field() // @SERVER
    @IsString()
    @MaxLength(32)
    @MaxLength(32)
    @MinLength(8, {
        message: (args: ValidationArguments) => {
            return "Password is too short, minimum length is " + args.constraints[0] + " characters";
        }
    })
    password!: string;

    @Field() // @SERVER
    @IsString()
    @MaxLength(32)
    @EqualsWith('password', {'message': 'The two passwords are different'})
    password2!: string;
}