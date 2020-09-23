import {useHistory} from "react-router-dom";
import {Form, message} from "antd";
import {useState} from "react";
import {gql, useMutation} from "@apollo/client";
import {SignUpInput} from "../generated-inputs/SignUpInput";
import {ClientSideValidation, ServerSideValidation} from "../utils/validation-tools";

const useSignUpForm = (dryRun: boolean = false) => {
    let history = useHistory();
    const [form] = Form.useForm();

    const [isSubmitDisabled, SetIsSubmitDisabled] = useState<boolean>(false);

    const [SignUp, {data}] = useMutation<() => void>(gql`
    mutation SignUp($email: String!, $password: String!, $password2: String!) {
      SignUp(data :{email: $email, password: $password, password2: $password2,}) {
        _id
        email
      }
    }  
    `);

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
            if (dryRun) {
                return;
            }
            SetIsSubmitDisabled(true);
            SignUp({variables: input}).then(() => {
                    // no error, both server and client side validations were passed
                    history.push("/");
                    message.info('Succesful registration, please sign in', 5)
                }
            ).catch(e => {
                // server side validation error
                SetIsSubmitDisabled(false);
                ServerSideValidation(form, input, e, () => {
                    // after server side validation errors were displayed
                });
            });
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo);
    };

    return {form, onFinish, onFinishFailed, isSubmitDisabled}
};

export default useSignUpForm;
