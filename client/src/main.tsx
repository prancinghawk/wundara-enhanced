import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import WundaraThemeProvider from './theme/ThemeProvider';

console.log('🚀 Main.tsx is executing');

const rootElement = document.getElementById('root');
console.log('📍 Root element:', rootElement);

if (rootElement) {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <WundaraThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WundaraThemeProvider>
      </React.StrictMode>
    );
    console.log('✅ React app rendered successfully');
  } catch (error) {
    console.error('❌ Error rendering React app:', error);
    // Fallback to simple content
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #dc2626;">⚠️ App Loading Error</h1>
        <p>There was an error loading the app.</p>
        <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px;">${error}</pre>
      </div>
    `;
  }
} else {
  console.error('❌ Root element not found');
}
