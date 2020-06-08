import {Card, Dropdown, Layout, Menu, message, Modal, Tag} from 'antd';
import {DownOutlined, ExclamationCircleOutlined} from '@ant-design/icons';

import React from 'react';
import {gql, useMutation, useQuery} from "@apollo/client";
import {withRouter} from "react-router-dom";
import {TopMenu} from './TopMenu';
import {QUERY_NOTE_LIST} from "./gql";

const {Content} = Layout;

const NoteList = withRouter(({history}) => {

    const {loading: getNotes_loading, data: getNotes_data, error: getNotes_error} = useQuery(QUERY_NOTE_LIST, {
        variables: {
            userId: JSON.parse(localStorage.getItem('user') || '{}')?._id
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
                    userId: JSON.parse(localStorage.getItem('user') || '{}')?._id
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

    if (getNotes_loading) {
        return <div>Loading...</div>
    }

    function confirm(id: string) {
        Modal.confirm({
            title: 'Are you sure delete this note?',
            icon: <ExclamationCircleOutlined/>,
            content: '',
            okText: 'Yes',
            cancelText: 'Cancel',
            onOk: () => {
                onCardActionClick('delete', id);
            }
        });
    }

    if (getNotes_data?.Notes) {
        const cards = (getNotes_data?.Notes.length === 0) ?
            // no notes
            (<p>No notes yet.</p>)
            :
            getNotes_data.Notes.map((note: any) => {
                const menu = (
                    <Menu>
                        <Menu.Item onClick={e => {
                            onCardActionClick('edit', note._id);
                        }}>
                            Modify
                        </Menu.Item>
                        <Menu.Item danger onClick={e => {
                            confirm(note._id)
                        }}>
                            Delete
                        </Menu.Item>
                    </Menu>
                );

                const dropdown = (
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            Actions <DownOutlined/>
                        </a>
                    </Dropdown>
                );
                const tags = (note.tags.length === 0) ? '' : note.tags.map((tag: any) => {
                    return <Tag key={note._id + tag._id} color="#108ee9">{tag.name}</Tag>
                })

                return <Card key={note._id} title={note.title} extra={dropdown}>
                    <Card.Grid hoverable={false} style={{width: "100%"}}>
                        {note.text}
                    </Card.Grid>
                    <Card.Grid hoverable={false} style={{width: "100%"}}>
                        {tags}
                    </Card.Grid>
                </Card>
            })

        return <Layout className="app-layout">
            <TopMenu selected="notes"/>
            <Content className="app-content">
                {cards}
            </Content>
        </Layout>
    } // if data.Notes

    // error
    return <p/>
});

export default NoteList;