import React from 'react';
import { AlertTriangle, Tag, CheckCircle, Activity, Info, MapPin } from 'lucide-react';
import EmergencyMap from './EmergencyMap';

const ActionDashboard = ({ responseData, isLoading, apiKey }) => {
  if (isLoading) {
    return (
      <div className="panel output-panel" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="loader" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--primary)' }}>Analyzing Situation and Synthesizing Intent...</p>
      </div>
    );
  }

  if (!responseData) {
    return (
      <div className="panel output-panel" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Activity size={48} color="var(--surface-border)" />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Structured actions will appear here.</p>
      </div>
    );
  }

  const { emergencyLevel, urgent, classification, immediateActions = [], structuredData = {}, summary } = responseData;

  const levelColor = 
    emergencyLevel === 'CRITICAL' ? 'critical' : 
    emergencyLevel === 'HIGH' ? 'high' : 
    'medium';

  const lat = structuredData?.latitude;
  const lng = structuredData?.longitude;

  return (
    <div className="panel output-panel">
      <h2>Structured Path</h2>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <span className={`tag ${levelColor}`}>
          {emergencyLevel} LEVEL
        </span>
        {urgent && (
          <span className="tag critical" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <AlertTriangle size={12} /> URGENT
          </span>
        )}
        <span className="tag" style={{ background: 'var(--surface-border)', color: '#fff', border: '1px solid transparent' }}>
          {classification}
        </span>
      </div>

      {summary && (
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={18} color="var(--primary)" /> Situation Summary
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{summary}</p>
        </div>
      )}

      {immediateActions.length > 0 && (
         <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
         <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <AlertTriangle size={18} color="var(--danger)" /> Immediate Actions
         </div>
         <ul className="action-list">
           {immediateActions.map((action, idx) => (
             <li key={idx} className="action-item">{action}</li>
           ))}
         </ul>
       </div>
      )}

      {Object.keys(structuredData).length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} color="var(--success)" /> Extracted Entities
          </div>
          <div className="structured-data">
            {Object.entries(structuredData).map(([key, value]) => (
              <React.Fragment key={key}>
                <div className="data-key">{key}</div>
                <div className="data-value">{typeof value === 'object' ? JSON.stringify(value) : value}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {lat && lng && (
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="var(--primary)" /> Tactical Location Map
          </div>
          <EmergencyMap lat={lat} lng={lng} apiKey={apiKey} />
        </div>
      )}
    </div>

  );
};

export default ActionDashboard;
