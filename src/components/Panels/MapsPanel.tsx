import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setAvailableMaps, setCurrentMapId, setLoading } from '../../store/slices/mapSlice';
import { 
  CalciteLoader,
  CalciteButton,
  CalciteIcon
} from '@esri/calcite-components-react';

interface MapItem {
  id: string;
  title: string;
  snippet: string;
  thumbnailUrl: string;
  owner: string;
  created: number;
  modified: number;
}

const MapsPanel = () => {
  const dispatch = useAppDispatch();
  // @ts-ignore - Temporary fix for Redux state typing issue
  const { loading, currentMapId } = useAppSelector((state) => state.map);
  // @ts-ignore - Temporary fix for Redux state typing issue  
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [maps, setMaps] = useState<MapItem[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserMaps();
    }
  }, [isAuthenticated]);

  const loadUserMaps = async () => {
    if (!window.esri) return;
    
    dispatch(setLoading(true));
    
    try {
      const credential = await window.esri.identity.IdentityManager.getCredential('https://www.arcgis.com/sharing/rest');
      
      const response = await fetch(
        `${credential.server}/search?f=json&q=type:"Web Map" AND owner:${credential.userId}&num=50&token=${credential.token}`
      );
      
      const data = await response.json();
      
      const mapItems: MapItem[] = data.results.map((item: any) => ({
        id: item.id,
        title: item.title,
        snippet: item.snippet || '',
        thumbnailUrl: item.thumbnail ? `${credential.server}/content/items/${item.id}/info/${item.thumbnail}?token=${credential.token}` : '',
        owner: item.owner,
        created: item.created,
        modified: item.modified,
      }));

      setMaps(mapItems);
      dispatch(setAvailableMaps(mapItems));
    } catch (error) {
      console.error('Failed to load maps:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleMapSelect = (mapId: string) => {
    dispatch(setCurrentMapId(mapId));
  };

  if (!isAuthenticated) {
    return (
      <div className="panel-content">
        <p>Please sign in to view your maps.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="panel-content">
        <CalciteLoader scale="s" />
        <p>Loading maps...</p>
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <CalciteLoader scale="m" />
        </div>
      ) : (
        <>
          {maps.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {maps.map((map) => (
                <div
                  key={map.id}
                  className={`modern-card ${map.id === currentMapId ? 'selected' : ''}`}
                  onClick={() => handleMapSelect(map.id)}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: map.id === currentMapId ? '2px solid var(--geovez-primary)' : '1px solid var(--geovez-border)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    {map.thumbnailUrl && (
                      <img
                        src={map.thumbnailUrl}
                        alt={map.title}
                        style={{ 
                          width: 80, 
                          height: 60, 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          flexShrink: 0
                        }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="card-title" style={{ 
                        margin: '0 0 0.5rem 0',
                        fontSize: '1rem',
                        color: map.id === currentMapId ? 'var(--geovez-primary)' : 'var(--geovez-text)'
                      }}>
                        {map.title}
                      </h3>
                      <p className="card-content" style={{ 
                        margin: '0 0 0.75rem 0',
                        fontSize: '0.9rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {map.snippet || 'No description available'}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        fontSize: '0.8rem',
                        color: 'var(--geovez-text-secondary)'
                      }}>
                        <span><CalciteIcon icon="user" scale="s" /> {map.owner}</span>
                        <span><CalciteIcon icon="calendar" scale="s" /> {new Date(map.modified).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {map.id === currentMapId && (
                      <CalciteIcon 
                        icon="check-circle" 
                        scale="s" 
                        style={{ color: 'var(--geovez-primary)', flexShrink: 0 }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="modern-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <CalciteIcon icon="map" scale="l" style={{ color: 'var(--geovez-text-secondary)', marginBottom: '1rem' }} />
              <h3 className="card-title">No Maps Found</h3>
              <p className="card-content">
                {isAuthenticated 
                  ? 'No web maps found in your account. Create some maps in ArcGIS Online to see them here.'
                  : 'Please sign in to view your maps.'
                }
              </p>
              {!isAuthenticated && (
                <CalciteButton 
                  className="modern-button" 
                  iconStart="sign-in"
                  style={{ marginTop: '1rem' }}
                >
                  Sign In
                </CalciteButton>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapsPanel;
