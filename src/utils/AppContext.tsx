import React, {createContext} from "react";

const useLocalStorageState = (key: string) => {
    const [value, setValue] = React.useState(
        JSON.parse(localStorage.getItem(key) || '{}')
    );

    React.useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value]);

    return [value, setValue];
};

const initialAppContext: { user: any; setUser: any } = {
    user: '{}',
    setUser: null
};

export const AppContext = createContext(initialAppContext);

export const AppProvider = ({children}: any) => {
    const [user, setUser] = useLocalStorageState(
        'user'
    );

    return (
        <AppContext.Provider value={{
            user,
            setUser
        }}>
            {children}
        </AppContext.Provider>
    );
};