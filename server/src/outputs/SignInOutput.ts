import {Field, ObjectType} from "type-graphql"; // @SERVER
import {User} from '../entities/User'

@ObjectType() // @SERVER
export class SignInOutput {
    @Field() // @SERVER
    user: User;

    @Field() // @SERVER
    csrfToken: string;

    @Field() // @SERVER
    expiration: number;
}