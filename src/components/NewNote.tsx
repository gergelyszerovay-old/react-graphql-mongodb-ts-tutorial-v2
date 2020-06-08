import {Form} from 'antd';
import React, {FC, useState} from 'react';
import {useMutation, useQuery} from "react-apollo";
import {gql} from "apollo-boost";
import {ClientSideValidation, ServerSideValidation} from "./validation-tools"
import {NewNoteInput} from "../generated-inputs/NewNoteInput";
import NoteModificationScreen from "./NoteModificationScreen";

const NewNote: FC = () => {
    const [form] = Form.useForm();

    const [isSubmitDisabled, SetIsSubmitDisabled] = useState<boolean>(false);

    const QUERY_TAGS = gql`  
    query Tags($userId: String!) {
      Tags(userId: $userId) {
        _id
        name
        userId
      }
    }
    `

    const {loading: getTags_loading, data: getTags_data, error: getTags_error} = useQuery(QUERY_TAGS, {
        variables: {
            userId: JSON.parse(localStorage.getItem('user') || '{}')?._id
        }
        // fetchPolicy: 'no-cache'
    });

    const [NewNote, {data: NewNote_data}] = useMutation<() => void>(gql`
    mutation NewNote($title: String!, $text: String!, $tagIds: [String!]!) {
      NewNote(data :{title: $title, text: $text, tagIds: $tagIds}) {
        _id
        title
        text
        tags {
          _id
          name
          userId
        }         
      }
    }  
    `,
        {
            refetchQueries: [{
                query: QUERY_TAGS,
                variables: {
                    userId: JSON.parse(localStorage.getItem('user') || '{}')?._id
                },
            }],
            awaitRefetchQueries: true,
            onCompleted(data: any) {
                console.log(data)
                const newTags = data.NewNote.tags.map((tag: any) => (tag._id));
                console.log(newTags);
                form.setFieldsValue({
                    tagIds: newTags,
                });
            }
        });

    const onFinish = (values0: any) => {
        console.log('onFinish:', values0);

        // 'title', 'text', 'tagIds': if undefined, set to empty string or []
        const values0Update = Object.fromEntries(['title', 'text', 'tagIds'].map((k: string) => {
            if (values0[k]) return [k, values0[k]];
            if (k === 'tagIds') return [k, []];
            return [k, ''];
        }));

        // update values, set _id
        const values = Object.assign(values0, values0Update);

        const input = Object.assign(new NewNoteInput(), values);
        console.log(input)

        ClientSideValidation(form, input, () => {
            SetIsSubmitDisabled(true)
            NewNote({variables: input}).then((data) => {
                // successful save
                SetIsSubmitDisabled(false)
            }).catch(e => {
                // server side validation error
                SetIsSubmitDisabled(false)
                ServerSideValidation(form, input, e, () => {
                    // after server side validation errors displayed
                });
            });
        });
    };

    return <NoteModificationScreen form={form} tagsData={getTags_data} onFinish={onFinish}
                                   isSubmitDisabled={isSubmitDisabled} selectedMenuItem="newnote"/>

    // const options = (!getTags_data?.Tags) ? '' : getTags_data?.Tags.map((tag: any) => {
    //     return <Option key={tag._id} value={tag._id}>{tag.name}</Option>
    // })
    //
    // return (
    //     <Layout className="app-layout">
    //         <TopMenu selected="newnote"/>
    //         <Content className="app-content">
    //             <Row>
    //                 <Col xs={{span: 22, offset: 1}} md={{span: 12, offset: 6}}>
    //                     <Form
    //                         form={form}
    //                         name="NewNoteForm"
    //                         initialValues={{remember: false}}
    //                         onFinish={onFinish}
    //                         layout="vertical"
    //                     >
    //                         <Form.Item name="title" label="Title">
    //                             <Input/>
    //                         </Form.Item>
    //                         <Form.Item name="text" label="Text">
    //                             <TextArea rows={4}/>
    //                         </Form.Item>
    //                         <Form.Item name="tagIds" label="Tags">
    //                             <Select mode="tags" style={{width: '100%'}} placeholder="Tags">
    //                                 {options}
    //                             </Select>
    //                         </Form.Item>
    //                         <Form.Item>
    //                             <Button type="primary" htmlType="submit" style={{width: "100%"}} disabled={isSubmitDisabled}>New
    //                                 note</Button>
    //                         </Form.Item>
    //                     </Form>
    //                 </Col>
    //             </Row>
    //         </Content>
    //     </Layout>
    //
    // )
}

export default NewNote;
