import {AuthChecker} from "type-graphql";
import {Context} from "../apollo-context.interface";
import * as csrf from "csrf";
import {IS_CSRF_CHECK_ENABLED} from "../config";

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