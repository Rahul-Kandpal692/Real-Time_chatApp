import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import Logout from './Logout';
import ChatInput from './ChatInput';
import Messages from './Messages';
import axios from 'axios';
import { useRef } from 'react';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import {v4 as uuidv4} from 'uuid';

export default function ChatContainer({currentChat,currentUser,socket} ) {

  const [messages,setMessages]=useState([]);
  const[arrivalMessage,setArrivalMessage]=useState(null);
  const scrollRef=useRef();

  useEffect( ()=>{
    if(currentChat){
    async function  getAllMessages(){
    const response = await axios.post(getAllMessagesRoute,{
      from:currentUser._id,
      to:currentChat._id
    });
    setMessages(response.data);
  }
  getAllMessages();
  }
  },[currentChat]);

  const handleSendMsg = async(msg)=>{
    await axios.post(sendMessageRoute,{ 
      from:currentUser._id,
      to:currentChat._id,
      message:msg
    });
    socket.current.emit("send-msg",{
      to:currentChat._id,
      from:currentUser._id,
      message:msg
    });
    const msgs = [...messages];
    msgs.push({fromSelf:true,message:msg});
    setMessages(msgs);
  };

  useEffect(()=>{
    if(socket.current){
      socket.current.on("msg-recieve",(msg)=>{
        setArrivalMessage({fromSelf:false,message:msg});
      });
    }
  },[]);

  useEffect(()=>{
    arrivalMessage&&setMessages((prev)=>[...prev,arrivalMessage]);
  },[arrivalMessage]);

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behaviour:"smooth"});
  },[messages]);


  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={currentChat.avatarImage} alt="avatar"></img>
          </div>
          <div className="username">
            <h3>
              {currentChat.username}
            </h3>
          </div>
        </div>
          
          <Logout></Logout>
          
      </div>
      <div className="chat-messages">
        {
          messages.map((message)=>{
            return(
              <div ref={scrollRef} key={uuidv4()}>
                <div className={`message ${message.fromSelf?"sended":"recieved"}`}>
                  <div className="content">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      <ChatInput handleSendMsg={handleSendMsg}></ChatInput>
    </Container>
  )
}

const Container= styled.div`
  padding-top:1rem;
  display:grid;
  grid-template-rows:10% 78% 12%;
  gap:0.1rem;
  overflow:hidden;
      @media screen and (min-width:720px) and (max-width:1080px);
    grid-template-rows:15% 70% 15%;
  .chat-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding: 0.2rem 0.5rem;
    .user-details{
      display:flex;
      align-items:center;
      gap:1rem;
      .avatar{
        img{
          height:4rem;
        }
      }
      .username{
        h3{
          color:white;
        }
      }
    }
  }
  .chat-messages{
    padding:1rem 2rem;
    display:flex;
    flex-direction:column;
    gap:1rem;
    overflow:auto;
    .message{
      display:flex;
      align-items:center;
      .content{
        max-width:40%;
        over-flow-wrap:break-word;
        padding:1rem;
        font-size:1.1rem;
        border-radius:1rem;
        color:#d1d1d1;
      }
    }
      .sended{
        justify-content:flex-end;
        .content{
          background-color:#1f04ff21;
        }
      }
      .recieved{
        justify-content:flex-start;
        .content{
          background-color:#9900ff20;
        }
  }

`;
