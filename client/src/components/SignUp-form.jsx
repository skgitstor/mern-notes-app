import { Route, Link, Routes } from 'react-router-dom'
import axios from "axios"
import { useEffect, useState } from 'react'



const Ragisterform = () => {
    const [res, setRes] = useState('hello');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [crpassword, setCrPassword] = useState('');

    const enterName = (e) =>{
        setName(e.target.value)
        
    }
    const enterEmail = (e) =>{
        setEmail(e.target.value)
    }
    const enterPassword = (e) =>{
        setPassword(e.target.value)
    }
    const enterCrPassword = (e) =>{
        setCrPassword(e.target.value)
    }


    const showPassword = (e) => {
        if (e.target.checked) {

            NewPassword.type = 'text'
            NewPasswordC.type = 'text'
        } else {
            NewPassword.type = 'password'
            NewPasswordC.type = 'password'
        }
    }
    const newSubmit = async (e) => {
        e.preventDefault();
        try {
            // const formData = new FormData(e.target)

            if (password === crpassword){
                const userobj = {
                    "name": name,
                    "email": email,
                    "Password": password
                }
                const data = await axios.post("http://localHost:5000/userRagister", userobj,{withCredentials: true});
                setRes(data);
                setName('')
                setEmail('')
                setPassword('')
                setCrPassword('')

            }else{
                console.log("Password Doesn't match")
            }

        } catch (err) {
            console.log(err)
        }

        
    }
    useEffect(() => {
        if (res) {
            console.log(res);
        }
    }, [res])


    return (
        <>
            <div className="container">
                <div className="login-form">
                    <form onSubmit={(e) => { newSubmit(e); }}>
                        <div className="login-details d-flex flex-col">

                            <label htmlFor="newName">Name</label>
                            <input onChange={(e)=>{enterName(e)}} value={name} id='newName' type="text" name="newName" placeholder='Enter Your Name' />

                            <label htmlFor="newEmail">Email</label>
                            <input onChange={(e)=>{enterEmail(e)}} value={email} id='newEmail' type="text" name="newEmail" placeholder='Enter Email' />

                            <label htmlFor="NewPassword">Password</label>
                            <input onChange={(e)=>{enterPassword(e)}} value={password} id='NewPassword' type="password" name="NewPassword" placeholder='Password' />

                            <label htmlFor="NewPasswordC">Confirm Password</label>
                            <input onChange={(e)=>{enterCrPassword(e)}} value={crpassword} id='NewPasswordC' type="password" name="NewPasswordC" placeholder='Password' />

                        </div>

                        <div className='d-flex item-between justify-between'>
                            <div className='d-flex showpassword '>
                                <input onChange={(e) => { showPassword(e); }} type="checkbox" id="showpassword" name="showpassword" />
                                <label htmlFor="showpassword">show password</label>
                            </div>
                            <Link to="/Login/Recovery">Forgott Password</Link>
                        </div>
                        <div className="formbuttons">
                            <input id='signInButton' type="submit" />
                            <Link id='signUpOption' to="/authPage/Login">Have Account</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
export default Ragisterform;