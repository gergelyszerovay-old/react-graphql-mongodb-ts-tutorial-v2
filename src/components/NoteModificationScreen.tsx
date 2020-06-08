import {Button, Col, Form, Input, Layout, Row, Select} from 'antd';
import React, {FC} from 'react';
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
    isLoading?: boolean;
}

const NoteModificationScreen: FC<NoteModificationScreenProps> = ({tagsData, form, onFinish, isSubmitDisabled, selectedMenuItem, isLoading = false}: NoteModificationScreenProps) => {

    if (isLoading) {
        return (
            // <Layout className="app-layout">
            //     <TopMenu selected={selectedMenuItem}/>
            //     <Content className="app-content">
            <p>Loading...</p>
            //     </Content>
            // </Layout>
        )
    }

    const options = (!tagsData?.Tags) ? '' : tagsData?.Tags.map((tag: any) => {
        return <Option key={tag._id} value={tag._id}>{tag.name}</Option>
    })

    return (
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
    )
}

export default NoteModificationScreen;
