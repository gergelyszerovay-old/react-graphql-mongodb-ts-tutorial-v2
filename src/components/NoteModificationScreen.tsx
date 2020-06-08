import {Button, Col, Form, Input, Layout, Row, Select} from 'antd';
import React, {FC} from 'react';
import {TopMenu} from "./TopMenu";
import {FormInstance} from "antd/es/form";

const {TextArea} = Input;
const {Option} = Select;
const {Content} = Layout;

interface MatchParams {
    id: string;
}

interface NoteModificationScreenProps {
    tagsData: any;
    form: FormInstance;
    onFinish: (values: any) => void;
    isSubmitDisabled: boolean;
    selectedMenuItem: string;
}

const NoteModificationScreen: FC<NoteModificationScreenProps> = ({tagsData, form, onFinish, isSubmitDisabled, selectedMenuItem}: NoteModificationScreenProps) => {

    const options = (!tagsData?.Tags) ? '' : tagsData?.Tags.map((tag: any) => {
        return <Option key={tag._id} value={tag._id}>{tag.name}</Option>
    })

    return (
        <Layout className="app-layout">
            <TopMenu selected={selectedMenuItem}/>
            <Content className="app-content">
                <Row>
                    <Col xs={{span: 22, offset: 1}} md={{span: 12, offset: 6}}>
                        <Form
                            form={form}
                            name="EditNoteForm"
                            initialValues={{remember: false}}
                            onFinish={onFinish}
                            layout="vertical"
                        >
                            <Form.Item name="title" label="Title">
                                <Input/>
                            </Form.Item>
                            <Form.Item name="text" label="Text">
                                <TextArea rows={4}/>
                            </Form.Item>
                            <Form.Item name="tagIds" label="Tags">
                                <Select mode="tags" style={{width: '100%'}} placeholder="Tags">
                                    {options}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{width: "100%"}}
                                        disabled={isSubmitDisabled}>Modify
                                    note</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
        </Layout>

    )
}

export default NoteModificationScreen;
