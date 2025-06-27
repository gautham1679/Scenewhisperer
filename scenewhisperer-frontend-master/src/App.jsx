import React, { useEffect } from 'react';
import UploadForm from './UploadForm';

function App() {
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.body.style.overflowX = 'hidden'; // Prevent horizontal scroll
  }, []);

  return <UploadForm />;
}

export default App;
