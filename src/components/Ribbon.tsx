import React from "react";
import  '../styles/Ribbon.css';

const Ribbon = ({ visible, message, type = "info", onClose }: { visible: boolean; message: string; type?: string; onClose: () => void }) =>
   {
     return visible ? (<div className={`floating-ribbon ${type}`}>{message}
     <button className="close-btn" onClick={onClose}>X</button>
   </div>) : null;
    
   };

   export default Ribbon;