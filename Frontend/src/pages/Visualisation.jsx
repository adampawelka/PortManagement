import React from "react";
// Assuming you have imported the corrected ThumbRaiserComponent from the previous step
import ThumbRaiserComponent from "../components/Thumb_Raiser"; 

const Visualisation = () => {
  return (
    // The main container that centers the content horizontally
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <h1>Visualisation</h1>
      <p>This is the visualisation page.</p>

      <div 
          style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              width: '150%', 
              maxWidth: '1600px', 
              margin: '0px auto',
              marginBottom: '80px' 
          }}
      >
          <div className="VisualizationCanvasWrapper"> 
              <ThumbRaiserComponent /> 
          </div>
      </div>
      
    </main>
  );
};

export default Visualisation;