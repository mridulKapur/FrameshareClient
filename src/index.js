import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//FETCHING ON LOCAL SERVER WITH LOCAL CLIENT GIVES CORS ERROR.
//OPEN CMD AS ADMIN
//GO TO CHROME.EXE DIRECTORY
//cd ../../"program files (x86)"/google/chrome/application/
//chrome.exe --disable-site-isolation-trials --disable-web-security --user-data-dir="PATH_TO_PROJECT_DIRECTORY"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
