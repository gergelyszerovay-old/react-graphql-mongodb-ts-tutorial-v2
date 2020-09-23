import {useRouteMatch} from "react-router-dom";
import {Form} from "antd";
import {useContext, useState} from "react";
import {AppContext} from "../utils/AppContext";
import {useMutation, useQuery} from "@apollo/client";
import {MUTATION_EDIT_NOTE, QUERY_SINGLE_NOTE, QUERY_TAGS} from "../utils/gql";
import {EditNoteInput} from "../generated-inputs/EditNoteInput";
import {ClientSideValidation, ServerSideValidation} from "../utils/validation-tools";

interface MatchParams {
    id: string;
}

const useEditNoteForm = () => {
    let match = useRouteMatch<MatchParams>("/note/:id");

    const [form] = Form.useForm();

    const {user} = useContext(AppContext);

    const [isSubmitDisabled, SetIsSubmitDisabled] = useState<boolean>(false);

    const {loading: getTags_loading, data: getTags_data, error: getTags_error} = useQuery(QUERY_TAGS, {
        variables: {
            userId: user._id
        }
        // fetchPolicy: 'no-cache'
    });

    const {loading: getNote_loading, data: getNote_data, error: getNote_error} = useQuery(QUERY_SINGLE_NOTE, {
        variables: {
            _id: match?.params.id
        },
        onCompleted: data => {
            const note = Object.assign({}, data.SingleNote, {tagIds: data.SingleNote.tags.map((tag: any) => tag._id)});
            form.setFieldsValue(note);
        }
        // fetchPolicy: 'no-cache'
    });

    const [EditNote, {data: EditNote_data}] = useMutation<() => void>(MUTATION_EDIT_NOTE,
        {
            refetchQueries: [{
                query: QUERY_TAGS,
                variables: {
                    userId: user?._id
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

    const onFinish = (values: any): void => {
        console.log('onFinish:', values);

        // 'title', 'text', 'tagIds': if undefined, set to empty string or []
        const valuesUpdate = Object.fromEntries(['title', 'text', 'tagIds'].map((k: string) => {
            if (values[k]) return [k, values[k]];
            if (k === 'tagIds') return [k, []];
            return [k, ''];
        }));

        // + set _id
        const input = Object.assign(new EditNoteInput(), values, valuesUpdate, {_id: (getNote_data as any).SingleNote._id});
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
                    // after server side validation errors were displayed
                });
            });
        });
    };

    return {form, tagsData: getTags_data, isLoading: getTags_loading || getNote_loading, onFinish, isSubmitDisabled};
};

export default useEditNoteForm;
