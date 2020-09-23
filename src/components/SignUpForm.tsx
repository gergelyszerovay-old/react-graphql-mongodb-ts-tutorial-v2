import {Button, Col, Form, Input, Row} from 'antd';
import React, {FC} from "react";
import {LockOutlined, UserOutlined} from '@ant-design/icons';

interface SignUpFormProps {
    hook: any;
}

const SignUpForm: FC<SignUpFormProps> = ({hook}: SignUpFormProps) => {

    const {form, onFinish, onFinishFailed, isSubmitDisabled} = hook();
    return (
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
                        <Button type="primary" htmlType="submit" style={{width: "100%"}} disabled={isSubmitDisabled}>Sign
                            Up</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default SignUpForm;

