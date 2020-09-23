import {storiesOf} from '@storybook/react';
import * as React from 'react';
import {AppContext} from "../utils/AppContext";
import {TopMenu} from "./TopMenu";
import {BrowserRouter as Router} from "react-router-dom";
import {TopMenuSign} from "./TopMenuSign";

storiesOf("Menu", module)
    .add("TopMenu", () => {

        let user = {_id: "5efb35ed1838f672d078d21f"}
        const setUser = (x: any) => {
        }

        return (
            <AppContext.Provider value={{
                user, setUser
            }}>
                <Router>
                    <TopMenu selected="notes"/>
                </Router>
            </AppContext.Provider>
        )
    })
    .add("TopMenuSign", () => {

        let user = {_id: "5efb35ed1838f672d078d21f"}
        const setUser = (x: any) => {
        }

        return (
            <AppContext.Provider value={{
                user, setUser
            }}>
                <Router>
                    <TopMenuSign selected="signup"/>
                </Router>
            </AppContext.Provider>
        )
    });
