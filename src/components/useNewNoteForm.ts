import {useContext, useState} from "react";
import {AppContext} from "../utils/AppContext";
import {Form} from "antd";
import {useMutation, useQuery} from "@apollo/client";
import {MUTATION_NEW_NOTE, QUERY_NOTE_LIST, QUERY_TAGS} from "../utils/gql";
import {NewNoteInput} from "../generated-inputs/NewNoteInput";
import {ClientSideValidation, ServerSideValidation} from "../utils/validation-tools";

const useNewNoteForm = (dryRun: boolean = false) => {
    const {user} = useContext(AppContext);

    const [form] = Form.useForm();

    const [isSubmitDisabled, SetIsSubmitDisabled] = useState<boolean>(false);

    const {loading: getTags_loading, data: getTags_data, error: getTags_error} = useQuery(QUERY_TAGS, {
        variables: {
            userId: user?._id
        }
        // fetchPolicy: 'no-cache'
    });

    const [NewNote, {data: NewNote_data}] = useMutation<() => void>(MUTATION_NEW_NOTE,
        {
            refetchQueries: [{
                query: QUERY_TAGS,
                variables: {
                    userId: user?._id
                },
            }, {
                query: QUERY_NOTE_LIST,
                variables: {
                    userId: user?._id
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

    const onFinish = (values: any) => {
        console.log('onFinish:', values);

        // 'title', 'text', 'tagIds': if undefined, set to empty string or []
        const valuesUpdate = Object.fromEntries(['title', 'text', 'tagIds'].map((k: string) => {
            if (values[k]) return [k, values[k]];
            if (k === 'tagIds') return [k, []];
            return [k, ''];
        }));

        const input = Object.assign(new NewNoteInput(), values, valuesUpdate);
        console.log(input)

        ClientSideValidation(form, input, () => {
            if (dryRun) {
                return;
            }
            SetIsSubmitDisabled(true)
            NewNote({variables: input}).then((data) => {
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
    return {form, tagsData: getTags_data, isLoading: getTags_loading, onFinish, isSubmitDisabled}
};

export default useNewNoteForm;
