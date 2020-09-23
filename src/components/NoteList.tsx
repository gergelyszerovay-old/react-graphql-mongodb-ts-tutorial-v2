import {Card, Dropdown, Menu, Modal, Tag} from 'antd';
import {DownOutlined, ExclamationCircleOutlined} from '@ant-design/icons';

import React, {FC, Fragment} from 'react';

interface NoteListProps {
    hook: any;
}

const NoteList: FC<NoteListProps> = ({hook}: NoteListProps) => {
    const {getNotes_loading, getNotes_data, onCardActionClick} = hook();

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
        console.log(getNotes_data);

        if (getNotes_data?.Notes.length === 0) {
            // no notes
            return <p>No notes yet.</p>
        }

        const cards = getNotes_data.Notes.map((note: any) => {
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
        return <Fragment>{cards}</Fragment>
    } // if data.Notes

    // error
    return <p/>
};

export default NoteList;
