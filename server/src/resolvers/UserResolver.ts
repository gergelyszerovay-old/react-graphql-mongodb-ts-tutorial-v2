import {Arg, ArgumentValidationError, Authorized, Ctx, Mutation, Query, Resolver} from "type-graphql";

import {User} from "../entities/User";

import {SignUpInput} from "../inputs/SignUpInput"
import {SignInInput} from "../inputs/SignInInput"
import {SignInOutput} from "../outputs/SignInOutput"
import * as bcrypt from "bcryptjs";
import {ApolloError} from 'apollo-server-express'
import {getManager} from "typeorm";

import {ValidationError} from "class-validator"

import {Context} from "../apollo-context.interface";

import {sign} from "jsonwebtoken";

import * as csrf from 'csrf';

import {ACCESS_TOKEN_COOKIE_EXPIRY_SECONDS, ACCESS_TOKEN_COOKIE_HTTPS, ACCESS_TOKEN_SECRET} from "../config";

@Resolver()
export class UserResolver {
    @Authorized("USER")
    @Query(() => User)
    async Me(@Ctx() ctx: Context) {
        console.log(ctx.csrfToken);
        console.log(ctx.csrfSecret);
        console.log(ctx.jwt);

        const manager = getManager();
        const user = await manager.findOne(User, ctx.jwt.user.id);

        console.log(user);

        return Object.assign(user, {hashedPassword: ''});
    }

    @Mutation(() => User)
    async SignUp(@Arg("data") data: SignUpInput) { // , @Ctx() ctx: Context

        const manager = getManager();
        const user = await manager.findOne(User, {email: data.email});

        if (user) {
            const validationErrors: ValidationError[] = [{
                'property': 'email',
                'constraints': {'c1': 'This email is already used'},
                'children': []
            }];
            throw new ArgumentValidationError(validationErrors)
        }

        const hashedPassword: string = await bcrypt.hash(data.password, 10);
        const newUser: User = await User.create({
            email: data.email,
            hashedPassword: hashedPassword
        }).save()
        return Object.assign(newUser, {hashedPassword: ''});
    }

    @Mutation(() => SignInOutput)
    async SignIn(@Arg("data") data: SignInInput, @Ctx() ctx: Context) {

        const manager = getManager();
        const user = await manager.findOne(User, {email: data.email});

        if (!user) {
            throw new ApolloError("Application Error", "APPLICATION_ERROR", {
                applicationError: {
                    code: '',
                    message: 'Invalid email or password',
                    description: ''
                }
            });
        }

        const valid = await bcrypt.compare(data.password, user.hashedPassword);
        if (!valid) {
            throw new ApolloError("Application Error", "APPLICATION_ERROR", {
                applicationError: {
                    code: '',
                    message: 'Invalid email or password',
                    description: ''
                }
            });
        }

        const accessToken = sign({user: {id: user._id.toHexString()}}, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_COOKIE_EXPIRY_SECONDS
        });

        const expirationTS = Math.round((+new Date()) / 1000) + ACCESS_TOKEN_COOKIE_EXPIRY_SECONDS;

        ctx.res.cookie("access-token", accessToken, {
            maxAge: ACCESS_TOKEN_COOKIE_EXPIRY_SECONDS * 1000,
            secure: ACCESS_TOKEN_COOKIE_HTTPS,
            httpOnly: true
        });

        const tokens = new csrf();
        const csrfToken = tokens.create(ctx.csrfSecret)

        return {
            csrfToken,
            user: Object.assign(user, {hashedPassword: ''}),
            expiration: expirationTS
        };
    }

}