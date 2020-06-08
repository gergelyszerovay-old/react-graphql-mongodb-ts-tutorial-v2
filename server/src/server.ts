import "reflect-metadata";
import {createConnection} from "typeorm";

import {buildSchema} from "type-graphql";

import {ApolloServer} from "apollo-server-express";
import * as express from "express";
// import * as jwt from "express-jwt";
import {Context} from "./apollo-context.interface";

import {GenerateClientSideInputs} from './utils/GenerateClientSideInputs'

import {ACCESS_TOKEN_SECRET, MONGODB_CONNECTION_STRING} from "./config";

import * as cookieParser from "cookie-parser";
import {verify} from "jsonwebtoken";
import * as csrf from 'csrf';

import {UserResolver} from "./resolvers/UserResolver"
import {NoteResolver} from "./resolvers/NoteResolver"
import {TagResolver} from "./resolvers/TagResolver"
import {DebugResolver} from "./resolvers/DebugResolver"

import {User} from "./models/User";
import {Tag} from "./models/Tag";
import {Note} from "./models/Note";

import {CustomAuthChecker} from "./utils/CustomAuthChecker";

const tokens = new csrf();
const csrfSecret = tokens.secretSync();

const startServer = async () => {
    const schema = await buildSchema({
        resolvers: [UserResolver, NoteResolver, TagResolver, DebugResolver],
        authChecker: CustomAuthChecker,
        emitSchemaFile: {
            path: __dirname + '/../../generated-schemas/schema.gql',
            commentDescriptions: true,
            sortedSchema: false, // by default the printed schema is sorted alphabetically
        },
    })

    GenerateClientSideInputs(__dirname + '/inputs', __dirname + '/../../src/generated-inputs');

    const server = new ApolloServer({
        // These will be defined for both new or existing servers
        schema,
        // context: ({ req, res }: any) => ({ req, res }),
        context: ({req, res}): Context => {
            return {
                jwt: (req as any).jwt,
                csrfToken: req.header('x-csrf-token'),
                csrfSecret,
                res
            };
        },
        playground: {
            settings: {
                'editor.theme': 'light',
            }
        },
    });

    await createConnection({
        "type": "mongodb",
        "useNewUrlParser": true,
        'url': MONGODB_CONNECTION_STRING,
        "synchronize": true,
        "logging": true,
        "entities": [User, Tag, Note]
    });

    const app = express();
    const path = "/graphql";

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

    server.applyMiddleware({app, path});

    app.listen({port: 4001}, () =>
        console.log(`Server ready at http://localhost:4001${server.graphqlPath}`)
    );
};

startServer();