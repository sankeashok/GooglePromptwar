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

  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Automatically adopt the Production Fallback key if provided by the environment
    if (savedKey) {
      setApiKey(savedKey);
    } else if (envKey) {
      setApiKey(envKey);
    } else {
      setShowSettings(true);
    }
  }, []);

  const saveApiKey = (key) => {
    localStorage.setItem('gemini_api_key', key);
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
    </div>
  );
}

export default App;
