import {Button, Col, Form, Input, Layout, Row} from 'antd';
import React from 'react';
import {gql, useMutation} from "@apollo/client";
import {ClientSideValidation, ServerSideValidation} from "./validation-tools"
import {SignInInput} from "../generated-inputs/SignInInput";
import {Link, withRouter} from "react-router-dom";
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {TopMenuSign} from "./TopMenuSign";

const {Content} = Layout;

const SignInForm = withRouter(({history}) => {
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

    const onFinish = (values0: any) => {
        console.log('Success:', values0);

        // 'email', 'password': if undefined, set to empty string
        const values0Update = Object.fromEntries(['email', 'password'].map((k: string) => {
            if (values0[k]) return [k, values0[k]];
            return [k, ''];
        }));
        const values = Object.assign(values0, values0Update);

        const input = Object.assign(new SignInInput(), values);
        console.log(input)

        ClientSideValidation(form, input, () => {
            SignIn({variables: input}).then((data) => {
                localStorage.setItem('csrfToken', (data?.data as any).SignIn?.csrfToken);
                localStorage.setItem('user', JSON.stringify((data?.data as any).SignIn?.user));
                localStorage.setItem('expiration', (data?.data as any).SignIn?.expiration);

                history.push("/notes");
            }).catch(e => {
                // server side validation error
                ServerSideValidation(form, input, e, () => {
                    // after server side validation errors displayed
                });
            });
        });
    };

    // and clear local storage (+ logout)
    localStorage.clear();

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout className="app-layout">
            <TopMenuSign selected="signin"/>
            <Content className="app-content">
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
                                <Button type="primary" htmlType="submit" style={{width: "100%"}}>Sign In</Button>
                                Or <Link to="/signup">sign up now!</Link>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
});

export default SignInForm;

