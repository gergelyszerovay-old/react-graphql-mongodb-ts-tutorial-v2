import {storiesOf} from '@storybook/react';
import * as React from 'react';
import NoteNewAndEditForm from "./NoteNewAndEditForm";
import {BrowserRouter as Router} from "react-router-dom";
import {MockedProvider} from "@apollo/client/testing";
import {AppContext} from "../utils/AppContext";
import useNewNoteForm from "./useNewNoteForm";
import {QUERY_TAGS} from "../utils/gql";

storiesOf("NoteNewAndEditForm", module)
    .add("New", () => {
        const useNewNoteFormMocked = () => {
            return useNewNoteForm(true);
        }

        let user = {_id: "5efb35ed1838f672d078d21f"}
        const setUser = (x: any) => {
        }

        const gqlMocks = [
            {
                request: {
                    query: QUERY_TAGS,
                    variables: {userId: "5efb35ed1838f672d078d21f"},
                },
                result: {
                    "data": {
                        "Tags": [
                            {"_id": "5efb35f61838f672d078d220", "name": "Tag 1", "userId": "5efb35ed1838f672d078d21f"},
                            {"_id": "5efb4edebb22c95574de4cad", "name": "Tag 2", "userId": "5efb35ed1838f672d078d21f"}]
                    }
                }
            }
        ];


        return (
            <MockedProvider mocks={gqlMocks} addTypename={false}>
                <AppContext.Provider value={{
                    user, setUser
                }}>
                    <Router>
                        <NoteNewAndEditForm hook={useNewNoteFormMocked}/>
                    </Router>
                </AppContext.Provider>
            </MockedProvider>
        )
    });
