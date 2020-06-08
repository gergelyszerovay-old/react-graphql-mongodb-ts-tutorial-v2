import React, {FC} from "react";
import {ApolloProvider} from "react-apollo";
import ApolloClient from "apollo-boost";

import {BrowserRouter as Router, Route,} from "react-router-dom";

import 'antd/dist/antd.css';
import './App.css';

import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import NoteList from './NoteList'
import NewNote from './NewNote'
import EditNote from './EditNote'
import DebugScreen from './DebugScreen'

const App: FC<{ client: ApolloClient<any> }> = ({client}) => {
    return (
        <ApolloProvider client={client}>
            <Router>
                <Route exact path="/" component={SignInForm}/>
                <Route path="/signup" component={SignUpForm}/>
                <Route path="/notes" component={NoteList}/>
                <Route path="/newnote" component={NewNote}/>
                <Route path="/note/:id" component={EditNote}/>
                <Route path="/debug" component={DebugScreen}/>
            </Router>
        </ApolloProvider>
    );
}

export default App;
