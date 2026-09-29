import { createContext, useState } from "react";
export const stateContext = createContext();
function StateContext({ children }) {
    const [name1, setName] = useState('')
    const [loggedin, setLoggedIn] = useState(false)
    const obj = {
        name: name1,
        setName:setName,
        state1Set: setName,
        loggedin:loggedin,
        setLoggedIn:setLoggedIn
    }
    return (
        <>
            <div>
                <stateContext.Provider value={obj}>
                    {children}
                </stateContext.Provider>
            </div>
        </>)
}
export default StateContext;