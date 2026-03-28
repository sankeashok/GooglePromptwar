import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '12px',
  marginTop: '1rem',
  border: '1px solid var(--surface-border)'
};

function EmergencyMap({ lat, lng, apiKey }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const center = {
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  };

  if (!lat || !lng) return null;

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
    >
      <Marker 
        position={center} 
        animation={window.google?.maps.Animation.BOUNCE}
      />
    </GoogleMap>
  ) : (
    <div style={{...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p style={{color: 'var(--text-muted)'}}>Loading Tactical Map...</p>
    </div>
  );
}

export default React.memo(EmergencyMap);
