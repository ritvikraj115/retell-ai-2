import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { RetellWebClient } from 'retell-client-js-sdk';
import Wave from './Wave';
import { Link, useNavigate } from 'react-router-dom';
import { FcEndCall } from "react-icons/fc";
import styled from 'styled-components';
const Styles = styled.section`
  .body{
    minHeight:100vh,
    margin: auto;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    overflow: auto;
    background: linear-gradient(315deg, rgba(101,0,94,1) 3%, rgba(60,132,206,1) 38%, rgba(48,238,226,1) 68%, rgba(255,25,25,1) 98%);
    animation: gradient 15s ease infinite;
    background-size: 400% 400%;
    background-attachment: fixed;
      height:100vh
}

@keyframes gradient {
    0% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 100% 100%;
    }
    100% {
        background-position: 0% 0%;
    }
}

.wave {
    background: rgb(255 255 255 / 25%);
    border-radius: 1000% 1000% 0 0;
    position: fixed;
    width: 200%;
    height: 12em;
    animation: wave 10s -3s linear infinite;
    transform: translate3d(0, 0, 0);
    opacity: 0.8;
    bottom: 0;
    left: 0;
    z-index: -1;
}

.wave:nth-of-type(2) {
    bottom: -1.25em;
    animation: wave 18s linear reverse infinite;
    opacity: 0.8;
}

.wave:nth-of-type(3) {
    bottom: -2.5em;
    animation: wave 20s -1s reverse infinite;
    opacity: 0.9;
}

@keyframes wave {
    2% {
        transform: translateX(1);
    }

    25% {
        transform: translateX(-25%);
    }

    50% {
        transform: translateX(-50%);
    }

    75% {
        transform: translateX(-25%);
    }

    100% {
        transform: translateX(1);
    }
}
.question-container {
 background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7),
    rgba(50, 50, 50, 0.5)
  ); /* Transparent background gradient
  backdrop-filter: blur(5px); /* Adds a glass-like blur effect */
  margin:20px auto;
  margin-bottom: 100px;
  height: 50px;
  width: 400px;
  padding: 10px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  border-radius:50px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
   border: 4px solid transparent;
   color:white;
}


.project-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px; /* Match border radius of container */
  border: 4px solid transparent;
  background: linear-gradient(
    135deg,
    rgba(255, 0, 150, 0.3),
    rgba(0, 204, 255, 0.3)
  );
  z-index: -1;
  transition: background 0.3s ease;
}



.question-title {
  background: linear-gradient(45deg, #ff9a9e, #fad0c4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.question-point {
  color: #fff; /* Optional: You can set the text color of bullet points if desired */
}

.button {
  border: 4px solid transparent;
  font-weight: bold;
  margin:30px auto;
  padding: 25px 30px; /* Make it equal width and height for circular shape */
  border-radius: 50%; /* This makes the button circular */
  color: #333;
  background: linear-gradient(135deg, #ff9a9e, #fad0c4); /* Adding a gradient background for a more attractive look */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); /* Softer shadow for a more attractive feel */
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* Add transition for hover effects */
}

.button:hover {
  cursor: pointer;
  transform: scale(1.1); /* Slightly enlarge the button on hover */
  box-shadow: 0 7px 25px rgba(0, 0, 0, 0.4); /* Increase shadow on hover for a 'lifted' effect */
}

.projects-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 10px auto;
}
  
.project-container {
  background: linear-gradient(
    135deg,
    rgba(255, 0, 150, 0.9),
    rgba(0, 204, 255, 0.9)
  );
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  padding: 40px;
  margin: 150px auto;
  max-width: 1700px;
  color: #333;
  font-family: 'Arial', sans-serif;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
   border: 8px solid transparent;
}

.project-details {
  margin-bottom: 20px;
}

.project-name {
  font-size: 1.5rem;
  margin: 0;
}

.project-id {
  font-size: 0.9rem;
  color: #666;
}

.project-actions {
  display: flex;
  gap: 10px;
}
  .input-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
}

input {
    width: 100%;
    max-width: 400px; /* Adjust the max-width as needed */
    padding: 10px 15px;
    border: 2px solid #ddd;
    border-radius: 25px; /* Rounded corners */
    font-size: 16px;
    color: #fff;
    background: transparent;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
    border-color: #007bff; /* Change border color on focus */
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5); /* Add a glow effect on focus */
    outline: none; /* Remove default outline */
}

input::placeholder {
    color: #aaa; /* Placeholder text color */
}

`

function WebCall({id}) {
  var count =0;
  const [status, setStatus] = useState('Initializing...');
  const retellClientRef = useRef(null);
  const [error, setError] = useState(null);
  const [transcript, setTranscript]= useState(['Lets start'])
  const [speaking, setSpeaking]= useState(false);
  const [disconnect,setDisconnect]= useState(false);
  const navigate= useNavigate();
  

  async function fetchAccessToken() {
    if(count==0){
    try {
      let i =0;
      const response = await axios.post(`${process.env.REACT_APP_FRONTEND_URL}/api/create-web-call`, {
        agentId: id,
        apiKey: process.env.REACT_APP_RETELL_KEY
      });
      console.log(response)
      setStatus('Access token received!');
      const retellWebClient = new RetellWebClient();
      await retellWebClient.startCall({ accessToken: response.data.accessToken });
      retellClientRef.current=retellWebClient;
      retellWebClient.on("agent_start_talking", async() => {
          setSpeaking(true);
        });
        
        // When agent is done talking for the utterance
        // useful for animation
        retellWebClient.on("agent_stop_talking", async() => {
          setSpeaking(false);
          

        });
        retellWebClient.on("update",(update) => {
          try {
            setTranscript(update.transcript[update.transcript.length-1].content);
            
          } catch (error) {
            console.log(error)
            
          }
          
        })

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch access token or start call');
    }
  }}

  useEffect(() => {
    fetchAccessToken();
    count++;
  }, []);

  const end= ()=>{
    console.log('ending');
    retellClientRef.current.stopCall();
    navigate('/')
    alert('Call Ended')
  };

  return (
    <Styles>
    <div className="body">
      <div className='question-container'><h1 className='question-title'>Interview in Progress..</h1></div>
      <div  style={{
                margin:'30px auto',
                width: '200px',    /* Adjust size as needed */
                height: '200px',
                borderRadius: '50%', /* Makes the div a circle */
                border: '2px solid black', /* Optional: Border for visibility */
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', /* Centers the wave animation */
                overflow: 'hidden',
                background:'black'
        }}>

            <Wave isSpeaking={speaking} />
          </div>
      <div className='project-container'>
      <div style={{'fontSize':'30px','color':'white','margin':'100px'}}>{transcript}</div>
      <button onClick={end} className='button'>
        <FcEndCall size={30}/>
      </button>
      </div>
    </div>
    </Styles>
  );
}


export default WebCall;
