import {Form} from 'antd';
import React, {FC, useState} from 'react';
import {gql, useMutation, useQuery} from "@apollo/client";
import {ClientSideValidation, ServerSideValidation} from "./validation-tools"
import {EditNoteInput} from "../generated-inputs/EditNoteInput";
import {RouteComponentProps} from 'react-router-dom';
import NoteModificationScreen from "./NoteModificationScreen";
import {QUERY_NOTE_LIST, QUERY_TAGS} from "./gql";

interface MatchParams {
    id: string;
}

const EditNote: FC<RouteComponentProps<MatchParams>> = ({match}: RouteComponentProps<MatchParams>) => {
    const [form] = Form.useForm();

    const [isSubmitDisabled, SetIsSubmitDisabled] = useState<boolean>(false);

    const {loading: getTags_loading, data: getTags_data, error: getTags_error} = useQuery(QUERY_TAGS, {
        variables: {
            userId: JSON.parse(localStorage.getItem('user') || '{}')?._id
        }
        // fetchPolicy: 'no-cache'
    });

    const {loading: getNote_loading, data: getNote_data, error: getNote_error} = useQuery(gql`  
    query SingleNote($_id: String!) {
      SingleNote(_id: $_id) {
        _id
        title
        text
        tags {
          _id
          name
          userId
        }         
        userId
      }
    }
    `, {
        variables: {
            _id: match.params.id
        },
        onCompleted: data => {
            const note = Object.assign({}, data.SingleNote, {tagIds: data.SingleNote.tags.map((tag: any) => tag._id)});
            form.setFieldsValue(note);
        }
        // fetchPolicy: 'no-cache'
    });

    const [EditNote, {data: EditNote_data}] = useMutation<() => void>(gql`
    mutation EditNote($_id: String!, $title: String!, $text: String!, $tagIds: [String!]!) {
      EditNote(data :{_id: $_id, title: $title, text: $text, tagIds: $tagIds}) {
        _id
        title
        text
        tags {
          _id
          name
          userId
        }         
        userId
    }
    }  
    `,
        {
            refetchQueries: [{
                query: QUERY_TAGS,
                variables: {
                    userId: JSON.parse(localStorage.getItem('user') || '{}')?._id
                },
            }, {
                query: QUERY_NOTE_LIST,
                variables: {
                    userId: JSON.parse(localStorage.getItem('user') || '{}')?._id
                },
            }],
            awaitRefetchQueries: true,
            onCompleted(data: any) {
                const newTags = data.EditNote.tags.map((tag: any) => (tag._id));
                // console.log('xxx 1')
                form.setFieldsValue({
                    tagIds: newTags,
                });
                // console.log('xxx 2')
            }
        });

    const onFinish = (values0: any): void => {
        console.log('onFinish:', values0);

        // 'title', 'text', 'tagIds': if undefined, set to empty string or []
        const values0Update = Object.fromEntries(['title', 'text', 'tagIds'].map((k: string) => {
            if (values0[k]) return [k, values0[k]];
            if (k === 'tagIds') return [k, []];
            return [k, ''];
        }));

        // update values, set _id
        const values = Object.assign(values0, values0Update, {_id: (getNote_data as any).SingleNote._id});

        const input = Object.assign(new EditNoteInput(), values);
        console.log(input)

        ClientSideValidation(form, input, () => {
            SetIsSubmitDisabled(true)
            EditNote({variables: input}).then((data) => {
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
                                   isSubmitDisabled={isSubmitDisabled} selectedMenuItem="notes"/>
}

export default EditNote;
