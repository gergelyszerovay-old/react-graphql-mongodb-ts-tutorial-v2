import {Button, Divider, Layout} from 'antd';
import React, {FC, ReactElement} from 'react';
import {ApolloError, gql, useLazyQuery, useMutation} from "@apollo/client";
import {TopMenu} from "./TopMenu";
import {TopMenuSign} from "./TopMenuSign";

const {Content} = Layout;

const renderMe = (loading2: boolean, data2: any, error2?: ApolloError): ReactElement => {
    if (error2) {
        return <p>{error2.message}</p>;
    } else if (loading2) {
        return <p>Loading...</p>;
    } else if (data2) {
        return (
            <div>
                <p>{data2.Me._id}</p>
                <p>{data2.Me.email}</p>
            </div>
        );
    } else {
        return <p></p>;
    }
};


const DebugScreen: FC = () => {
    const [
        getMe,
        {loading: loading2, data: data2, error: error2}
    ] = useLazyQuery<() => void>(gql`  
    query { 
      Me {
        _id
        email
      }
    }
    `, {
        fetchPolicy: 'no-cache'
    });

    const me = renderMe(loading2, data2, error2);

    const [LoadDemoData, {data: LoadDemoData_data}] = useMutation<() => void>(gql`
    mutation {
      LoadDemoData
    }  
    `);

    const onLoadDemoData = async () => {
        await LoadDemoData();
    }

    const menu = localStorage.getItem('user') ? <TopMenu selected="debug"/> : <TopMenuSign selected="debug"/>;

    return <Layout className="app-layout">
        {menu}
        <Content className="app-content">
            <Button onClick={() => onLoadDemoData()} htmlType="button">
                Load demo data
            </Button>
            <Divider/>
            <Button onClick={() => getMe()} htmlType="button">
                Get me!
            </Button>
            {me}
        </Content>
    </Layout>
}

export default DebugScreen;
