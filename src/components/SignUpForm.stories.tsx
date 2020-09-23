import {storiesOf} from "@storybook/react";
import * as React from "react";
import SignUpForm from "./SignUpForm";
import {BrowserRouter as Router} from "react-router-dom";
import useSignUpForm from "./useSignUpForm";
import {MockedProvider} from "@apollo/client/testing";
import {AppContext} from "../utils/AppContext";

storiesOf("SignUpForm", module)
    .add("Form", () => {
        const useSignUpFormMock = () => {
            const hook = useSignUpForm(true);
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
                        <SignUpForm hook={useSignUpFormMock}/>
                    </Router>
                </AppContext.Provider>
            </MockedProvider>
        )
    });
