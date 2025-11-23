// Frontend/src/pages/Visualisation.jsx

import React from "react";
// Assuming you have imported the corrected ThumbRaiserComponent from the previous step
import ThumbRaiserComponent from "../components/Thumb_Raiser"; // <-- Use the correct component name

const Visualisation = () => {
  return (
    // The main container that centers the content horizontally
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <h1>Visualisation</h1>
      <p>This is the visualisation page.</p>

      {/* Contenedor que centra el canvas 3D y le da un ancho máximo */}
      <div 
          style={{ 
              display: 'flex', 
              justifyContent: 'center', // <--- CENTRADO CRÍTICO
              width: '150%', 
              maxWidth: '1600px', // Limita el ancho del renderizado
              margin: '0px auto',
              marginBottom: '80px' // <-- AÑADE ESTA PROPIEDAD
          }}
      >
          <div className="VisualizationCanvasWrapper"> 
              <ThumbRaiserComponent /> {/* Aquí se renderiza el canvas */}
          </div>
      </div>
      
    </main>
  );
};

export default Visualisation;