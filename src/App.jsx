import { useState, useEffect } from 'react';
import { Activity, Settings, X } from 'lucide-react';
import { resolveIntent, PROVIDERS } from './services/intentResolver';
import InputPanel from './components/InputPanel';
import ActionDashboard from './components/ActionDashboard';
import GlobalFeed from './components/GlobalFeed';

function App() {
  const [inputText, setInputText] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMimeType, setImageMimeType] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);

  const [apiKey, setApiKey] = useState(() => {
    try {
      // Prioritize environment variable in production
      const env = import.meta.env.VITE_GEMINI_API_KEY;
      if (env && env.trim().length > 10) return env;

      const saved = localStorage.getItem('gemini_api_key');
      if (saved && saved.trim().length > 10) return saved;
      
      return '';
    } catch (e) {
      console.warn("localStorage access denied:", e);
      const env = import.meta.env.VITE_GEMINI_API_KEY;
      return (env && env.trim().length > 10) ? env : '';
    }
  });

  const [showSettings, setShowSettings] = useState(() => {
    try {
      const hasEnv = !!(import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY.length > 10);
      if (hasEnv) return false; // Never show on load if env key is present

      const hasSaved = !!localStorage.getItem('gemini_api_key');
      return !hasSaved;
    } catch (e) {
      const hasEnv = !!(import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY.length > 10);
      return !hasEnv;
    }
  });

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('gemini_api_key');
      const envKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      const activeKey = (savedKey && savedKey.length > 10) ? savedKey : 
                        (envKey && envKey.length > 10) ? envKey : null;

      if (activeKey) {
        setApiKey(activeKey);
        setShowSettings(false); // Force hide if any key is valid
      }
    } catch (e) {
      console.warn("Effect: localStorage access denied:", e);
    }
  }, []);


  const saveApiKey = (key) => {
    try {
      localStorage.setItem('gemini_api_key', key);
    } catch (e) {
      console.warn("Failed to save to localStorage:", e);
    }
    setApiKey(key);
    setShowSettings(false);
  };


  const handleProcessIntent = async () => {
    if (!apiKey) {
      setError("Please configure your Gemini API Key in settings first.");
      setShowSettings(true);
      return;
    }

    if (!inputText.trim() && !imageBase64) {
      setError("Please provide some text or an image.");
      return;
    }

    setIsLoading(true);
    setError('');
    setResponseData(null);

    try {
      const result = await resolveIntent(PROVIDERS.GEMINI, apiKey, inputText, imageBase64, imageMimeType);
      
      if (result.error) {
        setError(result.error);
      } else {
        setResponseData(result);
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to process input. Check console or verify your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file) => {
    if (!file) {
      setImageBase64(null);
      setImageMimeType(null);
      setPreviewUrl(null);
      return;
    }
    
    setPreviewUrl(URL.createObjectURL(file));
    setImageMimeType(file.type);
    
    const reader = new FileReader();
    reader.onload = () => {
      // Split to get only the base64 part
      const base64String = reader.result.split(',')[1];
      setImageBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  const clearData = () => {
    setInputText('');
    setImageBase64(null);
    setImageMimeType(null);
    if(previewUrl) {
       URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setResponseData(null);
    setError('');
  };

  return (
    <div className="app-container">
      <header>
        <div className="brand">
          <Activity className="brand-icon" size={28} />
          LifeBridge
        </div>
        <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: 'auto'}}>
          AI Intent resolution system
        </div>
        <button 
          className="button" 
          style={{ background: 'transparent', padding: '0.5rem', color: 'var(--text)' }}
          onClick={() => setShowSettings(true)}
        >
          <Settings size={20} />
        </button>
      </header>

      <main className="main-content">
        <InputPanel 
          inputText={inputText}
          setInputText={setInputText}
          handleImageUpload={handleImageUpload}
          previewUrl={previewUrl}
          handleProcessIntent={handleProcessIntent}
          isLoading={isLoading}
          error={error}
          clearData={clearData}
        />
        
        <ActionDashboard 
          responseData={responseData} 
          isLoading={isLoading} 
          apiKey={apiKey}
        />
        
        <GlobalFeed />
      </main>

      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-content panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>Settings</h2>
              <button 
                onClick={() => setShowSettings(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Enter your Google Gemini API Key. It is stored securely in your browser's local storage and never sent to our servers.
            </p>
            <input 
              type="password" 
              placeholder="AIzaSy..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="api-input"
            />
            <button className="button" onClick={() => saveApiKey(apiKey)}>
              Save Key
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <span>&copy; 2026 LifeBridge | Powered by Gemini 1.5 Flash</span>
          <span className="version-tag">
            Build: V1.1-{(import.meta.env.VITE_APP_ENV === 'production' ? 'PROD' : (import.meta.env.VITE_APP_ENV || (import.meta.env.PROD ? 'PROD' : 'DEV'))).toUpperCase()} ({(__COMMIT_HASH__ || '????').slice(-4).toUpperCase()})
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
