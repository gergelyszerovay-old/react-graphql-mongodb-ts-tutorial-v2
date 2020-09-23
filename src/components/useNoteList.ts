import {useHistory} from "react-router-dom";
import {useContext} from "react";
import {AppContext} from "../utils/AppContext";
import {gql, useMutation, useQuery} from "@apollo/client";
import {QUERY_NOTE_LIST} from "../utils/gql";
import {message} from "antd";

const useNoteList = () => {
    let history = useHistory();
    const {user} = useContext(AppContext);

    const {loading: getNotes_loading, data: getNotes_data, error: getNotes_error} = useQuery(QUERY_NOTE_LIST, {
        variables: {
            userId: user?._id
        }
        // fetchPolicy: 'no-cache'
    });

    const [DeleteNote, {data: DeleteNote_data}] = useMutation<() => void>(gql`
    mutation DeleteNote($_id: String!) {
      DeleteNote(_id: $_id)
    }  
    `,
        {
            refetchQueries: [{
                query: QUERY_NOTE_LIST,
                variables: {
                    userId: user?._id
                },
            }]
        });

    const onCardActionClick = (action: string, noteId: string) => {
        console.log(action);
        console.log(noteId);
        if (action === 'edit') {
            history.push("/note/" + noteId);
        } else if (action === 'delete') {
            DeleteNote({variables: {_id: noteId}}).then(() => {
                message.success('Note deleted.');
            });
        }
    }
    return {getNotes_loading, getNotes_data, onCardActionClick}
}

export default useNoteList;
