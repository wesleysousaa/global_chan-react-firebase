import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Hooks
import { UserContextProvider } from './contexts/UserContext';
import { UsersContextProvider } from './contexts/UsersContext';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { SceneContextProvider } from './contexts/SceneContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <UsersContextProvider>
      <UserContextProvider>
        <ThemeContextProvider>
          <SceneContextProvider>
            <App />
          </SceneContextProvider>
        </ThemeContextProvider>
      </UserContextProvider>
    </UsersContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
