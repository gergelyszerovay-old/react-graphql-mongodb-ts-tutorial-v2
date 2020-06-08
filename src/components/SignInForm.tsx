import {Button, Col, Form, Input, Layout, Row} from 'antd';
import React, {useContext, useState} from 'react';
import {gql, useApolloClient, useMutation} from "@apollo/client";
import {ClientSideValidation, ServerSideValidation} from "../utils/validation-tools"
import {SignInInput} from "../generated-inputs/SignInInput";
import {Link, withRouter} from "react-router-dom";
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {AppContext} from "../utils/AppContext";

const {Content} = Layout;

const SignInForm = withRouter(({history}) => {
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

        SetIsSubmitDisabled(true);
        ClientSideValidation(form, input, () => {
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

    return (
        <Row>
            <Col xs={{span: 22, offset: 1}} md={{span: 12, offset: 6}}>
                <Form
                    form={form}
                    name="SignInForm"
                    initialValues={{remember: false}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item name="email">
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                               placeholder="Company email"/>
                    </Form.Item>

                    <Form.Item name="password">
                        <Input prefix={<LockOutlined className="site-form-item-icon"/>} type="password"
                               placeholder="Password"/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{width: "100%"}} disabled={isSubmitDisabled}>Sign
                            In</Button>
                        Or <Link to="/signup">sign up now!</Link>
                    </Form.Item>
                    {isSubmitDisabled}
                </Form>
            </Col>
        </Row>
    );
});

export default SignInForm;

