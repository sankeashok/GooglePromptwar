import { useState } from 'react';
import { Activity, ShieldAlert } from 'lucide-react';
import { processIntent } from './services/geminiService';
import InputPanel from './components/InputPanel';
import ActionDashboard from './components/ActionDashboard';

function App() {
  const [inputText, setInputText] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMimeType, setImageMimeType] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);

  const handleProcessIntent = async () => {
    if (!inputText.trim() && !imageBase64) {
      setError("Please provide some text or an image.");
      return;
    }

    setIsLoading(true);
    setError('');
    setResponseData(null);

    try {
      const result = await processIntent(inputText, imageBase64, imageMimeType);
      
      if (result.error) {
        setError(result.error);
      } else {
        setResponseData(result);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to process input. Check console for details.");
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
        />
      </main>
    </div>
  );
}

export default App;
