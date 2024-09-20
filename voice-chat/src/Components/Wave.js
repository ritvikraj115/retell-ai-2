import React, { useState } from 'react';
import Wavify from 'react-wavify';
const Wave = ({ speaking }) => {
    return (
      <div style={{ marginTop: '50px'}}>
          <Wavify 
          fill="white" /* Assuming the wave fill is white or transparent */
          paused={speaking} 
          options={{
            height: 30,
            amplitude: 30,
            speed: 0.35,
            points: 5
          }} 
        />
      </div>
    );
  };
  export default Wave;