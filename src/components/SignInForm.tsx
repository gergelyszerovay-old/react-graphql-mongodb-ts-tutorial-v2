import {Button, Col, Form, Input, Row} from 'antd';
import React, {FC} from 'react';
import {Link} from "react-router-dom";
import {LockOutlined, UserOutlined} from '@ant-design/icons';

interface SignInFormProps {
    hook: any;
}

const SignInForm: FC<SignInFormProps> = ({hook}: SignInFormProps) => {
    const {form, onFinish, onFinishFailed, isSubmitDisabled} = hook()

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
};

export default SignInForm;

