import React from 'react'
import styled from "styled-components"
// import Login from './Login';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Logo from'../assests/logo.svg'
import { useState,useEffect } from 'react';
import axios from "axios";
import {toast,ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { loginRoute } from '../utils/APIRoutes';
import ParticlesBackground from '../components/ParticlesBackground';

function Login() {
    const navigate=useNavigate();
    const[values,setValues]=useState({
        username:"",
        password:"",
    });
    const toastOptions={
        position:"bottom-right",
        autoClose:5000,
        pauseOnHover:true,
        draggable:true, 
        theme:"dark"
    }

    useEffect(()=>{
      if(localStorage.getItem('chat-app-user')){
        navigate('/');
      }
    },[])
    const handleSubmit=async (event)=>{
        event.preventDefault();
        if(handlevalidation()){
            console.log("In validation",loginRoute);
            const{password,username}=values;
            const{data}=await axios.post(loginRoute,{
                username,
                
                password
                
            }); 
            if(data.status===false){
                toast.error(data.msg,toastOptions);
            }
            if(data.status===true){
                localStorage.setItem('chat-app-user',JSON.stringify(data.user));
              navigate("/");
            }
            
        };
    }
    const handlevalidation=()=>{
        const{password,username}=values;
        if(password===""){
            toast.error("Password is required",toastOptions);
            return false;
        }
        else if(username.length===""){
            toast.error("Username is required",toastOptions);
            return false;
        }
        return true; 
    }
    

    const handleChange=(event)=>{
        setValues({
            ...values,
            [event.target.name]:event.target.value
        })
    }
  return (
    <>
    
      <FormContainer>
        <form onSubmit={(event)=>handleSubmit(event)}>
            <div className='brand'>
                <img src={Logo} alt='Logo'></img>
                <h1>Snappy</h1>
            </div>
            <input 
                type='text' 
                placeholder='Username' 
                name="username" 
                onChange={(e)=>handleChange(e)}
                min="3"
            />
            <input 
                type='password' 
                placeholder='Password' 
                name="password" 
                onChange={(e)=>handleChange(e)}
            />
            <button type='submit'>Log In</button>

            <span>
                Don't have an account ? <Link to="/register">Register</Link>
            </span>

        
        </form>
      </FormContainer>
      
      <ToastContainer />
    </>
  )
}


const FormContainer=styled.div`
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:1rem;
    align-items:center;
    // background-color:#131324;
    .brand{
        display:flex;
        align-items:center;
        gap:1rem;
        justify-content:center;
        img{
            height:5rem;
        }
        h1{
            color:white;
            text-transform:uppercase;
        }
    }
    form{
        display:flex;
        flex-direction:column;
        gap:2rem;
        background-color:#00000076;
        border-radius:2rem;
        padding:3rem 5rem;
        input{
            background-color:transparent;
            padding:1rem;
            border:0.1rem solid #4e0eff;
            border-radius:0.4rem;
            color:white;
            width:100%;
            font-size:1rem;
            &:focus{
                border:0.1rem solid #997af0;
                outline:none
            }
        }
        button{
            background-color:#997af0;
            color:white;
            padding:1rem 2rem;
            border:none;
            font-weight:bold;
            cursor:pointer;
            border-radius:0.4rem;
            font-size:1rem;
            text-transform:uppercase;
            transition:0.5s ease-in-out;
            &:hover{
            background-color:#4e0eff;
            }
        }
        span{
            color:white;
            text-transform:uppercase;
            a{
               color:#4e0eff;
               text-decoration:none;
               font-weight:bold ;
            }
        }
    }
`;


export default Login;

