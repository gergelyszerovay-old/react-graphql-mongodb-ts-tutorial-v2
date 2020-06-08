# Simple note taking app that demonstrates how to integrate React, GraphQL and MongoDB using Typescript

The project uses the following packages on client side:

* TypeScript 3.7.5
* **Apollo Client 3.0.0-rc.2**
* React 16.13.1, (the project uses only functional components, hooks and context)
* Ant Design 4.3.1
* Class Validator 0.12.2 for input/form validation
* React Router 5.2

The project uses the following packages on server side:

* TypeScript 3.7.5
* Apollo Server Express 2.13.1 with **TypeGraphQL 1.0.0-rc.2**
* TypeORM 0.2.25 with Dataloader
* Class Validator 0.12.2 for input/form validation
* JSONWebToken and CSRF for JWT based authentication and CSRF protection

# Project Highlights

* [JWT based authentication](#jwt-based-authentication)
* [It uses the same classes to represent the entities in MongoDB and GraphQL](#it-uses-the-same-classes-to-represent-the-entities-in-mongodb-and-graphQL)
* [Same input validation code on the server and client side](#same-input-validation-code-on-the-server-and-on-the-client side)
* It uses Dataloader to optimize MongoDB queries ([/server/src/resolvers/NoteResolver.ts](https://github.com/gergelyszerovay/react-graphql-mongodb-ts-tutorial-v2/blob/master/server/src/resolvers/NoteResolver.ts))

# Available Scripts

We bootstrapped the client part of this project with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start-server`

Runs the server part of the app. Open [http://localhost:4001/graphql](http://localhost:4001/graphql) to view GraphiQL and the schema in your browser.

The source code of the app's server part is in the /server/ folder of this repository.

You should edit the `/server/src/config.ts` file to set the connection parameters of MongoDB.

The server generates the input validation code for the client side (`/src/generated-inputs/`) and it also exports its GraphQL schema to `/generated-schemas/schema.gql`.

### `npm start`

Runs the app in development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. 

To load the demo data, choose the 'Load demo data' option from the 'Debug' menu. The demo data contains 3 users: user1@example.com, user2@example.com and user3@example.com. Their passwords are the same as their email addresses.

The source code of the app's client part is in the root folder of this repository.

# Project Highlights Detailed

## JWT based authentication

* We store The JWT authentication token in the `access-token` cookie. It's http only, so it can't be stolen by the attacker in case of an XSS attack.
* The CSRF protection uses the `x-csrf-token` header. We send this header to the server by using an Apollo Link. 
* The information about the logged in user on the client side is stored in the localStorage, we set and access it via a React Context (`AppContext`)
* We didn't implement the renewalof the JWT authentication token

### Server side

We extract the values of the `access-token` cookie and the `x-csrf-token` header into Context of the Apollo Server:

[/server/src/server.ts](https://github.com/gergelyszerovay/react-graphql-mongodb-ts-tutorial-v2/blob/master/server/src/server.ts) :
```
    const server = new ApolloServer({
       schema,
       context: ({req, res}): Context => {
           return {
               jwt: (req as any).jwt,
               csrfToken: req.header('x-csrf-token'),
               csrfSecret,
               res
           };
       },
        ...
   });

...

    app.use(cookieParser());
    app.use((req, _, next) => {
        const accessTokenCookie = req.cookies["access-token"];
        if (accessTokenCookie) {
            try {
                const data = verify(accessTokenCookie, ACCESS_TOKEN_SECRET) as any;
                (req as any).jwt = data;
            } catch {
            }
        }

        const accessTokenHeader = req.header('x-access-token');
        if (accessTokenHeader) {
            try {
                const data = verify(accessTokenHeader, ACCESS_TOKEN_SECRET) as any;
                (req as any).jwt = data;
            } catch {
            }
        }

        next();
    });
```

Except for the sign-in and sign-up mutations, we use a custom TypeGraphQL AuthChecker to verify that 
* the user is logged in (has JWT token) 
* and the CSRF protection header is set

[/server/src/utils/CustomAuthChecker.ts](https://github.com/gergelyszerovay/react-graphql-mongodb-ts-tutorial-v2/blob/master/server/src/utils/CustomAuthChecker.ts)
```
export const CustomAuthChecker: AuthChecker<Context> = (
    {context},
    roles, // root, args, info
) => {
    if (!context.jwt) {
        console.log('No context.jwt');
        return false;
    }

    if (IS_CSRF_CHECK_ENABLED) {
        const tokens = new csrf();
        if (!tokens.verify(context.csrfSecret, context.csrfToken)) {
            console.log('No csrfToken');
            return false;
        }
    }

    if (roles.includes('USER')) {
        return true;
    }

    return false;
};
```

### Client side

We use an Apollo Link to send the `x-csrf-token` header with each GraphQL request:

[/src/index.tsx](https://github.com/gergelyszerovay/react-graphql-mongodb-ts-tutorial-v2/blob/master/src/index.tsx)
```
    const authLink = setContext((_, {headers}) => {
        // get the authentication token from local storage if it exists
        const token = localStorage.getItem('csrfToken');
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                'x-csrf-token': token ? token : "",
            }
        }
    });

```

We store the information about the authenticated user in the localStorage, we set and access it via a React Context (`AppContext`): [/src/utils/AppContext.tsx](https://github.com/gergelyszerovay/react-graphql-mongodb-ts-tutorial-v2/blob/master/src/utils/AppContext.tsx)

## It uses the same classes to represent the entities in MongoDB and GraphQL

For example, the `User` entity has the following fields in MongoDB: _id, email, hashedPassword
It has only the _id and email fields in GraphQL queries and mutations, we never send the users’ password through the network:

(/server/src/entities/User.ts)[https://github.com/gergelyszerovay/react-graphql-mongodb-ts-tutorial-v2/blob/master/server/src/entities/User.ts]

```
import {BaseEntity, Column, Entity, ObjectIdColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {IsString, MaxLength} from 'class-validator'

import {ObjectID} from "mongodb";

@Entity("users")
@ObjectType()
export class User extends BaseEntity {
    @Field(() => ID)
    @ObjectIdColumn()
    _id: ObjectID;

    @Field(() => String)
    @Column()
    @IsString()
    @MaxLength(128)
    email: string;

    // db only
    @Column()
    hashedPassword: string;
}
```

## Same input validation code on the server and on the client side

We use the same Class Validator based code to validate the input on server and on the client side. 

For example, here is the validation code of the sign-up form and the `SignUp(data: SignUpInput!): User!` mutation:

[/server/src/inputs/SignUpInput.ts](https://github.com/gergelyszerovay/react-graphql-mongodb-ts-tutorial-v2/blob/master/server/src/inputs/SignUpInput.ts)

```
import {Field, InputType} from "type-graphql"; // @SERVER
import { IsEmail, IsString, MaxLength, MinLength, registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

function EqualsWith(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            ...
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
```

It uses a custom Class Validator decorator for comparing the two passwords. It also contains custom error messages.

To make this code work on the client side, we use the `// @SERVER` comment to mark the TypeGraphQL related lines. We don't need these on the client side, so when the server starts, it copies the files from the `/server/src/inputs` folder to the `/src/generated-inputs/` folder and removes the marked lines.

We can also use the [js-conditional-compile-loader](https://github.com/hzsrc/js-conditional-compile-loader) Webpack module to enable conditional compiling.

Class Validator is integrated into TypeGraphQL on the server side, we call it manually on the client side: 

[/src/components/SignUpForm.tsx](https://github.com/gergelyszerovay/react-graphql-mongodb-ts-tutorial-v2/blob/master/src/components/SignUpForm.tsx)

```
    const onFinish = (values: any) => {
        console.log('onFinish:', values);

        // 'email', 'password', 'password2': if undefined, set to empty string
        const valuesUpdate = Object.fromEntries(['email', 'password', 'password2'].map((k: string) => {
            if (values[k]) return [k, values[k]];
            return [k, ''];
        }));

        const input = Object.assign(new SignUpInput(), values, valuesUpdate);
        console.log(input)

        ClientSideValidation(form, input, () => {
            SignUp({variables: input}).then(() => {
                    // no error, both server and client side validations were passed
                    history.push("/");
                    message.info('Succesful registration, please sign in', 5)
                }
            ).catch(e => {
                // server side validation error
                ServerSideValidation(form, input, e, () => {
                    // after server side validation errors were displayed
                });
            });
        });
    };
```

# TODO

* React component refactoring for Jest based tests
* Server and client side tests
* Better error handling for network errors

# Known problems

Sometimes the following warnings appear on the browser's console:

* 'Warning: Can't perform a React state update on an unmounted component.' This warning is caused by Apollo Client, see this issue: [https://github.com/apollographql/apollo-client/issues/6209](https://github.com/apollographql/apollo-client/issues/6209) 
* 'Warning: findDOMNode is deprecated in StrictMode.' This warning is caused Ant Design, see this issue: [https://github.com/ant-design/ant-design/issues/22493](https://github.com/ant-design/ant-design/issues/22493)
