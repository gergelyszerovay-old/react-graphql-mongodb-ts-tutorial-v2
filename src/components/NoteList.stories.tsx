import {storiesOf} from "@storybook/react";
import * as React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import NoteList from "./NoteList";


const noteListData = {
    "Notes": [
        {
            "__typename": "Note",
            "_id": "000000000000000030001003",
            "title": "Note 3",
            "text": "Text 3",
            "tags": []
        },
        {
            "__typename": "Note",
            "_id": "000000000000000030001002",
            "title": "Note 2",
            "text": "Text 2",
            "tags": [
                {
                    "__typename": "Tag",
                    "_id": "000000000000000020001001",
                    "name": "tag1"
                },
                {
                    "__typename": "Tag",
                    "_id": "000000000000000020001003",
                    "name": "tag3"
                }
            ]
        },
        {
            "__typename": "Note",
            "_id": "000000000000000030001001",
            "title": "Note 1",
            "text": "Text 1",
            "tags": [
                {
                    "__typename": "Tag",
                    "_id": "000000000000000020001001",
                    "name": "tag1"
                },
                {
                    "__typename": "Tag",
                    "_id": "000000000000000020001002",
                    "name": "tag2"
                }
            ]
        }
    ]
};

storiesOf("NoteList", module)
    .add("NoteList", () => {
        const useNoteListMock = () => {
            return {
                getNotes_loading: false,
                getNotes_data: noteListData,
                onCardActionClick: () => {
                }
            };
        }

        return (
            <Router>
                <NoteList hook={useNoteListMock}/>
            </Router>
        )
    });
