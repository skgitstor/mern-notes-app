import axios from "axios";
import { createContext, useContext, useEffect } from "react";
import { stateContext } from "./stateContext";
import { useNavigate } from "react-router-dom";
export const functionContext = createContext()

function FunctionContext({ children }){ // Main Function...
    const states = useContext(stateContext)






    const check = async () => {
        try {
            const loginCheck = await axios.get("http://localhost:5000/api/check-session", { withCredentials: true });

            // console.log(loginCheck.data.user)
            states.setName(loginCheck.data.user.name)
            states.setEmail(loginCheck.data.user.email)
            // console.log(loginCheck.data.user.name)

            states.setLoggedIn(true);
            // console.log(loginCheck.status)

        } catch (err) {
            console.log('connection is not working...', err)

            states.setLoggedIn(false);
            // console.log(err)
        }

    }

    const Logout = async (e) => {
        e.preventDefault();
        const logout = await axios.get("http://localhost:5000/api/logout", { withCredentials: true });
        states.setLoggedIn(false);
    }

    useEffect(() => {
        check();
        // setLoggedIn([check.data])
    }, [states.loggedin])







    // console.log(`states in functionContext...${states}`)
  

    const obj = { Logout }
    return (
        <>
            <functionContext.Provider value={obj}>
                {children}
            </functionContext.Provider>

        </>)
}
export default FunctionContext;