import {Layout, Menu} from "antd";
import React, {FC} from "react";
import {Link} from "react-router-dom";

const {Header} = Layout;

type TopMenuSignProps = {
    selected: string
}

export const TopMenuSign: FC<TopMenuSignProps> = ({selected}: TopMenuSignProps) => {
    return (
        <Header>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[selected]}>
                <Menu.Item key="signin" id="app-top-menu-signin">Sign In<Link to="/"/></Menu.Item>
                <Menu.Item key="signup" id="app-top-menu-signup">Sign Up<Link to="/signup"/></Menu.Item>
                <Menu.Item key="debug" id="app-top-menu-debug">Debug<Link to="/debug"/></Menu.Item>
            </Menu>
        </Header>
    )
}
