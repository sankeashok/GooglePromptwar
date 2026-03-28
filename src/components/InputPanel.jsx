import { ImagePlus, Send, XCircle } from 'lucide-react';
import React, { useRef } from 'react';

const InputPanel = ({
  inputText,
  setInputText,
  handleImageUpload,
  previewUrl,
  handleProcessIntent,
  isLoading,
  error,
  clearData
}) => {
  const fileInputRef = useRef(null);

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className="panel input-panel">
      <h2>Capture Intent</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Paste unstructured transcriptions, weather reports, medical history, or drop an image.
      </p>

      <textarea
        placeholder="Enter messy intent here... (e.g. 'There is a huge crash on I-95, 3 cars involved, looks like someone is bleeding from the head, we need help fast')"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={isLoading}
      />

      <div 
        className="file-drop" 
        onDragOver={onDragOver} 
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImagePlus size={32} />
        {previewUrl ? 'Image Attached' : 'Click or drop an image (JPEG, PNG)'}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      
      {previewUrl && (
        <img src={previewUrl} alt="Preview" className="img-preview" />
      )}

      {error && <div style={{ color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
        <button 
          className="button" 
          style={{ background: 'transparent', border: '1px solid var(--surface-border)' }}
          onClick={clearData}
          disabled={isLoading}
        >
          <XCircle size={18} /> Clear
        </button>

        <button 
          className="button" 
          style={{ flex: 1 }}
          onClick={handleProcessIntent}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            <><Send size={18} /> Process Intent</>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
