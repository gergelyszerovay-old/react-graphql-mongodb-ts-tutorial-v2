import {Layout, Menu} from "antd";
import React, {FC} from "react";
import {Link} from "react-router-dom";

const {Header} = Layout;

type TopMenuProps = {
    selected: string
}

export const TopMenu: FC<TopMenuProps> = ({selected}: TopMenuProps) => {
    return (
        <Header>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[selected]}>
                <Menu.Item key="notes">Note List<Link to="/notes"/></Menu.Item>
                <Menu.Item key="newnote">New Note<Link to="/newnote"/></Menu.Item>
                <Menu.Item key="logout">Logout<Link to="/"/></Menu.Item>
                <Menu.Item key="debug">Debug<Link to="/debug"/></Menu.Item>
            </Menu>
        </Header>
    )
}
