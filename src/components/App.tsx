import React, {FC, useContext} from "react";
import {ApolloClient, ApolloProvider} from "@apollo/client";

import {BrowserRouter as Router, Redirect, Route,} from "react-router-dom";

import 'antd/dist/antd.css';
import './App.css';

import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import NoteList from './NoteList'
import NewNote from './NewNote'
import EditNote from './EditNote'
import DebugScreen from './DebugScreen'
import {TopMenu} from "./TopMenu";
import {TopMenuSign} from "./TopMenuSign";
import {Layout} from "antd";
import {AppContext} from "../utils/AppContext";

const {Content} = Layout;


const App: FC<{ client: ApolloClient<any> }> = ({client}) => {
    const {user} = useContext(AppContext);

    console.log('App', user);

    const routes = [
        {
            path: '/', // sign in
            exact: true,
            menu: () => <TopMenuSign selected="signin"/>,
            content: () => <SignInForm/>
        },
        {
            path: '/signup',
            exact: true,
            menu: () => <TopMenuSign selected="signup"/>,
            content: () => <SignUpForm/>
        },
        {
            path: '/notes',
            exact: true,
            menu: () => <TopMenu selected="notes"/>,
            content: () => (user?._id ? <NoteList/> : <Redirect to="/"/>)
        },
        {
            path: '/newnote',
            exact: true,
            menu: () => <TopMenu selected="notes"/>,
            content: () => (user?._id ? <NewNote/> : <Redirect to="/"/>)
        },
        {
            path: '/note/:id',
            menu: () => <TopMenu selected="notes"/>,
            content: ({match, history, location}: any) => (user?._id ?
                <EditNote/> : <Redirect to="/"/>)
        },
        {
            path: '/debug',
            exact: true,
            menu: () => (user?._id ? <TopMenu selected="debug"/> : <TopMenuSign selected="debug"/>),
            content: () => <DebugScreen/>
        },
    ]

    return (
        <ApolloProvider client={client}>
            <Router>
                <Layout className="app-layout">
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            component={route.menu}
                        />
                    ))}

                    <Content className="app-content">
                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                component={route.content}
                            />
                        ))}
                    </Content>
                </Layout>
            </Router>
        </ApolloProvider>
    );
}

export default App;
