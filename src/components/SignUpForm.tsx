import {Button, Col, Form, Input, Layout, message, Row} from 'antd';
import React from "react";
import {SignUpInput} from "../generated-inputs/SignUpInput"
import {useMutation} from "react-apollo";
import {gql} from "apollo-boost";
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {ClientSideValidation, ServerSideValidation} from "./validation-tools"
import {withRouter} from "react-router-dom";
import {TopMenuSign} from "./TopMenuSign";

const {Content} = Layout;

const SignUpForm = withRouter(({history}) => {
    const [form] = Form.useForm();

    const [SignUp, {data}] = useMutation<() => void>(gql`
    mutation SignUp($email: String!, $password: String!, $password2: String!) {
      SignUp(data :{email: $email, password: $password, password2: $password2,}) {
        _id
        email
      }
    }  
    `);

    const onFinish = (values0: any) => {
        console.log('onFinish:', values0);

        // 'email', 'password', 'password2': if undefined, set to empty string
        const values0Update = Object.fromEntries(['email', 'password', 'password2'].map((k: string) => {
            if (values0[k]) return [k, values0[k]];
            return [k, ''];
        }));
        const values = Object.assign(values0, values0Update);

        const input = Object.assign(new SignUpInput(), values);
        console.log(input)

        ClientSideValidation(form, input, () => {
            SignUp({variables: input}).then(() => {
                    history.push("/");
                    message.info('Succesful registration, please sign in', 5)
                }
            ).catch(e => {
                // server side validation error
                ServerSideValidation(form, input, e, () => {
                    // after server side validation errors displayed
                });
            });
        });

        return;

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo);
    };

    return (
        <Layout className="app-layout">
            <TopMenuSign selected="signup"/>
            <Content className="app-content">
                <Row>
                    <Col xs={{span: 22, offset: 1}} md={{span: 12, offset: 6}}>
                        <Form
                            form={form}
                            name="RegistrationForm"
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

                            <Form.Item name="password2">
                                <Input prefix={<LockOutlined className="site-form-item-icon"/>} type="password"
                                       placeholder="Confirm password"/>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{width: "100%"}}>Sign Up</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
});

export default SignUpForm;

