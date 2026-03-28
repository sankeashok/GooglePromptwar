import React, { useState, useEffect } from 'react';
import { Shield, Radio, Clock } from 'lucide-react';
import { query, collection, orderBy, limit, onSnapshot, getFirestore } from 'firebase/firestore';

/**
 * GlobalFeed Component
 * Renders a real-time stream of the latest resolved intents from Firestore.
 * Demonstrates high-tier Google Cloud synchronization features.
 */
const GlobalFeed = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    try {
      const db = getFirestore();
      const q = query(
        collection(db, "emergency_events"),
        orderBy("timestamp", "desc"),
        limit(5)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const eventList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventList);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Global Feed: Live connection pending Firebase initialization.");
    }
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="global-feed">
      <div className="feed-header">
        <Radio className="pulse" size={16} color="#ff4d4d" />
        <h4>LIVE DISASTER FEED</h4>
      </div>
      <div className="feed-items">
        {events.map((event) => (
          <div key={event.id} className="feed-item">
            <div className="item-meta">
              <span className={`severity-dot ${event.emergencyLevel?.toLowerCase()}`} />
              <span className="timestamp">
                 <Clock size={10} /> 
                 {event.timestamp?.toDate ? event.timestamp.toDate().toLocaleTimeString() : 'Just now'}
              </span>
            </div>
            <p className="item-summary">{event.summary?.substring(0, 80)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalFeed;
