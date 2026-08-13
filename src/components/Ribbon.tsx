import React from "react";
import  '../styles/Ribbon.css';

const Ribbon = ({ visible, message, type = "info", onClose }: { visible: boolean; message: string; type?: string; onClose: () => void }) =>
   {
     return visible ? (
       <div className={`floating-ribbon ${type}`}>
         <span className="ribbon-message">{message}</span>
         <button className="icon-btn close-btn" aria-label="Close ribbon" onClick={onClose}>×</button>
       </div>
     ) : null;
    
   };

   export default Ribbon;