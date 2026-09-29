import { createContext, useEffect, useState } from "react";
export const stateContext = createContext();
function StateContext({ children }) { // Main function...
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loggedin, setLoggedIn] = useState(false)
    
    const obj = {
        name,
        setName,
        email,
        setEmail,
        loggedin,
        setLoggedIn
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