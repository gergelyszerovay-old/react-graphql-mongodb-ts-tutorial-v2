import {Button, Col, Form, Input, Row, Select} from 'antd';
import React, {FC} from 'react';

const {TextArea} = Input;
const {Option} = Select;

interface NoteNewAndEditFormProps {
    hook: any;
}

const NoteNewAndEditForm: FC<NoteNewAndEditFormProps> = ({hook}: NoteNewAndEditFormProps) => {

    const {form, tagsData, isLoading, onFinish, isSubmitDisabled} = hook();

    if (isLoading) {
        return (
            <p>Loading...</p>
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

export default NoteNewAndEditForm;
