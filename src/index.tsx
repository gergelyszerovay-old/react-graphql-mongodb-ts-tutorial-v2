import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import {message} from 'antd';

import {ApolloClient, ApolloLink, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from '@apollo/link-context';
import {onError} from "@apollo/link-error";

import * as serviceWorker from './serviceWorker';
import {AppProvider} from "./utils/AppContext";
import {MUTATION_LOAD_DEMO_DATA} from './utils/gql';

async function bootstrap() {
    const httpLink = createHttpLink({
        uri: "http://" + window.location.hostname + ":3000/graphql",
        credentials: 'same-origin'
    });

    const authLink = setContext((_, {headers}) => {
        // get the authentication token from local storage if it exists
        const token = localStorage.getItem('csrfToken');
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                'x-csrf-token': token ? token : "",
            }
        }
    });

    const errorLink = onError(({graphQLErrors}) => {
        if (graphQLErrors) {
            console.log('b');
            graphQLErrors.map(({message: messageText}) => {
                if (messageText === "Application Error") return;
                if (messageText === 'Argument Validation Error') return;
                message.error(messageText)
            });
        }
    });

    const link = ApolloLink.from([errorLink, authLink, httpLink]);

    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link
    });

    (window as any).appTest = (action: string, params?: any) => {
        if (action === 'load_demo_data') {
            (async () => {
                await client.mutate({
                    mutation: MUTATION_LOAD_DEMO_DATA
                })
            })();
        }
    };

    ReactDOM.render(
        <React.StrictMode>
            <AppProvider>
                <App client={client}/>
            </AppProvider>
        </React.StrictMode>,
        document.getElementById('root')
    );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

bootstrap();

