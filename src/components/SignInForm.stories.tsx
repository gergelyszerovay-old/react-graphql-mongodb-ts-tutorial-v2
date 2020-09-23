import {storiesOf} from "@storybook/react";
import * as React from "react";
import SignInForm from "./SignInForm";
import {BrowserRouter as Router} from "react-router-dom";
import useSignInForm from "./useSignInForm";
import {MockedProvider} from "@apollo/client/testing";
import {AppContext} from "../utils/AppContext";

storiesOf("SignInForm", module)
    .add("Form", () => {
        const useSignInFormMock = () => {
            const hook = useSignInForm(true);
            return {
                form: hook.form,
                onFinish: hook.onFinish,
                onFinishFailed: () => {
                },
                isSubmitDisabled: false
            };
        }

        let user = {_id: "5efb35ed1838f672d078d21f"}
        const setUser = (x: any) => {
        }

        return (
            <MockedProvider addTypename={false}>
                <AppContext.Provider value={{
                    user, setUser
                }}>
                    <Router>
                        <SignInForm hook={useSignInFormMock}/>
                    </Router>
                </AppContext.Provider>
            </MockedProvider>
        )
    });
