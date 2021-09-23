import React, { useEffect } from "react";
import './ApiDoc.css';

function ApiDoc() {

  useEffect(() => {
    window.open("https://google.com/contact");
  }, []);

  return (
    <div className='api-Document-Container p-4'>
    </div>
  );
}

export default ApiDoc;