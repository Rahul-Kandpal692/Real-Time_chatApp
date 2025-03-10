import React from 'react'
import styled from "styled-components"
import Login from './Login';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import loader from'../assests/loader.gif'
import { useState,useEffect } from 'react';
import axios from "axios";
import {toast,ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { setAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from 'buffer';

export default function SetAvatar() {
    const api = 'https://robohash.org';
    const navigate=useNavigate();
    const [avatars,setAvatars]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [selectedAvatar,setSelectedAvatar]=useState(undefined);
    const toastOptions={
        position:"bottom-right",
        autoClose:5000,
        pauseOnHover:true,
        draggable:true,
        theme:"dark"
    }
    
    useEffect(()=>{
        if(!localStorage.getItem('chat-app-user')){
          navigate('/login');
        }
      },[])
    
    const setProfilePicture=async ()=>{
        if(selectedAvatar===undefined){
            toast.error("Please select an avatar",toastOptions);
        }
        else{
            const user=await JSON.parse(localStorage.getItem("chat-app-user"));
            const {data}=await axios.post(`${setAvatarRoute}/${user._id}`,{
                image:avatars[selectedAvatar], 
            });
            if(data.isSet){
                user.isAvatarImageSet=true;
                user.avatarImage=data.image;
                localStorage.setItem("chat-app-user",JSON.stringify(user));
                navigate('/');
            }
            else{
                toast.error("Error in setting avatar. Please try again !",toastOptions);
            }
        }
    };
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    useEffect(() => {
        const fetchAvatars = async () => {
            const data = [];
            for (let i = 0; i < 4; i++) {
                try {
                    const seed = Math.random().toString(36).substring(7);
                    const image = `${api}/${seed}.png`;
                    data.push(image);
                    // Add a delay to avoid hitting the rate limit
                    await delay(1000);
                } catch (error) {
                    console.error('Error fetching avatar:', error);
                    toast.error('Error fetching avatar. Please try again later.', toastOptions);
                    break;
                }
            }
            setAvatars(data);
            setIsLoading(false);
        };

        fetchAvatars();
    }, []);
  return (
    <>
    {
        isLoading?<Container>
            <img src={loader} alt="loader" className='loader'></img>
        </Container>:(

            <Container>
        <div className="title-container">
            <h1>
                Pick an avatar as your profile picture
            </h1>

        </div>
        <div className='avatars'>
                        {avatars.map((avatar, index) => {
                            return (
                                <div
                            key={index}
                                    className={`avatar ${
                                        selectedAvatar === index ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedAvatar(index)}
                            >
                                    <img
                                        src={avatar}
                                    alt='avatar'
                                />
                                </div>
                            );
                        })}
                    </div>
                    <button className='submit-btn' onClick={setProfilePicture}>Set as Profile Picture</button>
    </Container>
    )}
    <ToastContainer/>
    </>
  )
}

const Container= styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    gap:3rem;
    background-color:#131324;
    height:100vh;
    width:100vw;
    .loader{
        max-inline-size:100%;
    }
    .title-container{
        h1{
            color:white;
        }
    }
    .avatars {
        display: flex;
        gap: 2rem;

        .avatar {
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
            img {
                height: 6rem;
                border-radius: 50%;
                cursor: pointer;
            }
            &.selected {
                border: 0.4rem solid #4e0eff;
            }
        }
    }
    .submit-btn{
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
`;
