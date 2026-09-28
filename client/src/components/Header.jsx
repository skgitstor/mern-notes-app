import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Link, Routes } from 'react-router-dom'
const Header = () => {

    
    const [loggedin,setLoggedIn] = useState(false);
    const Logout = async (e) =>{
        e.preventDefault();
        const logout = await axios.get("http://localhost:5000/api/logout",{withCredentials: true});
        console.log(logout)
        setLoggedIn(false);
    }
    
    // let loggedin = false;

    const check = async () => {

        try{
            const loginCheck = await axios.get("http://localhost:5000/api/check-session",{withCredentials: true});
    
            setLoggedIn(true);
            // console.log(loginCheck.status)

        }catch(err){
            setLoggedIn(false);
            // console.log(err)
        }
        
    }
    useEffect( ()=>{
        check();
        // setLoggedIn([check.data])
    }, [loggedin])
    return (<>
        <header>

            <nav>
                <div className="navLeft"><Link to="/">Notes</Link></div>
                <div className="navCenter">
                    <ul className="navlinks">
                        <li className="navlink homelink">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="navlink noteslink">
                            <Link to="/Notes">Notes</Link>
                        </li>
                        <li className="navlink addnotelink">
                            <Link to="/StarNotes">StarNotes</Link>
                        </li>
                        <li className="navlink settingslink">
                            <Link to="/Settings">Settings</Link>
                        </li>
                    </ul>
                </div>
                {/* <div className="navRight"><Link to="/Profile">Profile</Link></div> */}
                <div className="d-flex navRight">

                    {loggedin == true ? <Link onClick={(e)=>{Logout(e);}}>Logout</Link>:<Link to="/authPage/login">Login</Link>
                    }
                    
                </div>
            </nav>
        </header>
    </>);
}
export default Header;