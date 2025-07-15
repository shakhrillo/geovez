import React from 'react';
import { CalciteIcon, CalciteButton } from '@esri/calcite-components-react';

const BookmarksPanel: React.FC = () => {
  return (
    <div>
      <div className="modern-card">
        <div className="card-title">
          <CalciteIcon icon="bookmark" scale="s" style={{ marginRight: '0.5rem' }} />
          Spatial Bookmarks
        </div>
        <div className="card-content">
          Save and manage your favorite map locations for quick access.
        </div>
        <CalciteButton 
          className="modern-button" 
          iconStart="plus"
          style={{ marginTop: '1rem' }}
        >
          Add Bookmark
        </CalciteButton>
      </div>
      
      <div className="modern-card">
        <div className="card-title">Quick Locations</div>
        <div className="card-content">
          <div style={{ color: 'var(--geovez-text-secondary)', textAlign: 'center', padding: '2rem' }}>
            <CalciteIcon icon="bookmark" scale="l" />
            <p style={{ marginTop: '1rem' }}>No bookmarks saved yet</p>
            <p style={{ fontSize: '0.9rem' }}>Create bookmarks to quickly navigate to important locations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarksPanel;
