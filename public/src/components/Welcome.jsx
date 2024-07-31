import React from 'react'
import styled from 'styled-components'
import Robot from "../assests/robot.gif";

export default function Welcome({currentUser}) {
  return (
    <Container>
        <img src={Robot} alt='Welcome'></img>
        <h1>
            Welcome, <span>{currentUser.username} !</span>
        </h1>
        <h3>Please select the chat to message</h3>
    </Container>
  )
}

const Container= styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    color:white;
    span{
        color:#4e00ff;
    }

`;
