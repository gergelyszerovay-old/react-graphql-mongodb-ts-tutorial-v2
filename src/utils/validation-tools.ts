import {validate} from "class-validator";
import {FieldData} from "rc-field-form/es/interface";
import {FormInstance} from "antd/lib/form";
import {ApolloError} from "@apollo/client";
import {message} from "antd";

const convertValidationErrorsToAntFieldData = (values: any, validationErrors: any): FieldData[] => {
    return Object.keys(values).map((k) => {
            if (validationErrors) {
                for (const e of validationErrors) {
                    if (e['property'] === k) {
                        return {name: k, errors: Object.values(e['constraints'] as any) as string[]}
                    }
                }
            }
            return {name: k, errors: []};
        }
    )
};

export const ServerSideValidation = (form: FormInstance, input: any, apolloErrors: ApolloError, cbOnError: () => void) => {
    // const apolloErrors = e as ApolloError;
    if (apolloErrors) {
        apolloErrors.graphQLErrors.forEach(apolloError => {
            // console.log(apolloError.message)

            const validationErrors = (apolloError.message === 'Argument Validation Error' ? apolloError.extensions?.exception?.validationErrors : undefined);
            // console.log(validationErrors);

            const formErrors: FieldData[] = convertValidationErrorsToAntFieldData(input, validationErrors)

            // console.log("formErrors: ", JSON.stringify(formErrors, null, 2));
            form.setFields(formErrors);

            const applicationError = (apolloError.message === 'Application Error' ? apolloError.extensions?.exception?.applicationError : undefined);

            if (applicationError) {
                // notification.error({"message": applicationError.message, 'description': applicationError.description, 'duration': 0})
                message.error(applicationError.message, 3);
            }

        })

    } else {
        cbOnError();
    }
};

export const ClientSideValidation = (form: FormInstance, input: any, cbOnNoError: () => void) => {
    validate(input).then(errors => {
        // console.log("errors: ", JSON.stringify(errors, null, 2));

        const formErrors: FieldData[] = convertValidationErrorsToAntFieldData(input, errors)
        console.log("formErrors: ", JSON.stringify(formErrors, null, 2));

        form.setFields(formErrors);

        if (errors.length === 0) {
            cbOnNoError();
        }
    });

}

// errors:  [
//     {
//         "target": {
//             "email": "",
//             "password": ""
//         },
//         "value": "",
//         "property": "email",
//         "children": [],
//         "constraints": {
//             "minLength": "Email is too short",
//             "isEmail": "email must be an email"
//         }
//     },
//     {
//         "target": {
//             "email": "",
//             "password": ""
//         },
//         "value": "",
//         "property": "password",
//         "children": [],
//         "constraints": {
//             "minLength": "Too short, minimum length is 8 characters"
//         }
//     }
// ]

