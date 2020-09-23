import {useHistory} from "react-router-dom";
import {useContext, useState} from "react";
import {AppContext} from "../utils/AppContext";
import {gql, useApolloClient, useMutation} from "@apollo/client";
import {Form} from "antd";
import {SignInInput} from "../generated-inputs/SignInInput";
import {ClientSideValidation, ServerSideValidation} from "../utils/validation-tools";

const useSignInForm = (dryRun: boolean = false) => {
    let history = useHistory();

    const {user, setUser} = useContext(AppContext);

    const [isSubmitDisabled, SetIsSubmitDisabled] = useState<boolean>(false);

    const client = useApolloClient();

    const [form] = Form.useForm();

    const [SignIn, {data}] = useMutation<() => void>(gql`
    mutation SignIn($email: String!, $password: String!) {
      SignIn(data :{email: $email, password: $password}) {
        csrfToken
        expiration
        user { 
            _id
            email 
        }
      }
    }  
    `);

    const onFinish = (values: any) => {
        console.log('Success:', values);

        // 'email', 'password': if undefined, set to empty string
        const valuesUpdate = Object.fromEntries(['email', 'password'].map((k: string) => {
            if (values[k]) return [k, values[k]];
            return [k, ''];
        }));

        const input = Object.assign(new SignInInput(), values, valuesUpdate);
        console.log(input)

        ClientSideValidation(form, input, () => {
            if (dryRun) {
                return;
            }
            SetIsSubmitDisabled(true);
            SignIn({variables: input}).then((data) => {
                setUser((data?.data as any).SignIn?.user);

                localStorage.setItem('csrfToken', (data?.data as any).SignIn?.csrfToken);
                // localStorage.setItem('expiration', (data?.data as any).SignIn?.expiration);

                history.push("/notes");
            }).catch(e => {
                // server side validation error
                SetIsSubmitDisabled(false);
                ServerSideValidation(form, input, e, () => {
                    // after server side validation errors were displayed
                });
            });
        });
    };

    // and clear local storage (+ logout)
    localStorage.clear();
    // clear Apollo Client's cache
    client.clearStore().then(() => {

    })

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return {form, onFinish, onFinishFailed, isSubmitDisabled};
};

export default useSignInForm;
