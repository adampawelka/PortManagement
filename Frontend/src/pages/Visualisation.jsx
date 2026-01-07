// Frontend/src/pages/Visualisation.jsx
import React from "react";
import ThumbRaiserComponent from "../components/Thumb_Raiser";

// Frontend/src/pages/Visualisation.jsx

const Visualisation = () => {
  return (
    <main style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <h1>Visualisation</h1>
      <p>This is the visualisation page.</p>

      {/* Contenedor GRANDE y FIJO */}
      <div>
          <ThumbRaiserComponent /> 
      </div>
      
    </main>
  );
};
export default Visualisation;