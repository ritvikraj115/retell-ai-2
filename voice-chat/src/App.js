import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import WebCall from './Components/WebCall';


function App() {
  const [data, setData] = useState('');

  // Function to receive data from the child component
  const handleDataFromChild = (childData) => {
    setData(childData);
  };
  return (
    <>
    <Routes>
      <Route path='/:id' element={<Home handleDataFromChild={handleDataFromChild} />}></Route>
      <Route path='/webcall' element={<WebCall id={data}/>}></Route>
    </Routes>
    </>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    display:'flex',
    flexDirection:'column',
    padding:'80px',
    alignItems:'center',
    background: `url('https://img.freepik.com/free-vector/sound-wave-gray-digital-background-entertainment-technology_53876-119613.jpg') no-repeat center center fixed`, // Background image
    backgroundSize: 'cover', // Ensures the image covers the entire background
    color: 'black', // Text   color to ensure readability over the background
    minHeight: '100vh', // Ensures the container takes up the full viewport height
  },
  title: {
    fontSize: '34px',
    fontWeight: 'bold',
    color:'red',
    padding: '10px',
  },
};


export default App;

