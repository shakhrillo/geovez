import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { closeDrawer } from '../../store/slices/uiSlice';
import type { RootState } from '../../store';
import MapsPanel from '../Panels/MapsPanel';
import LayersPanel from '../Panels/LayersPanel';
import LegendPanel from '../Panels/LegendPanel';
import BookmarksPanel from '../Panels/BookmarksPanel';
import ToolsPanel from '../Panels/ToolsPanel';
import PrintPanel from '../Panels/PrintPanel';
import AdvancedSearchPanel from '../Panels/AdvancedSearchPanel';
import { 
  CalcitePanel,
  CalciteAction,
  CalciteIcon
} from '@esri/calcite-components-react';

const Drawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const ui = useAppSelector((state: RootState) => state.ui);
  const drawerContent = ui?.drawerContent;

  const handleClose = () => {
    dispatch(closeDrawer());
  };

  const renderContent = () => {
    switch (drawerContent) {
      case 'maps':
        return <MapsPanel />;
      case 'layers':
        return <LayersPanel />;
      case 'legend':
        return <LegendPanel />;
      case 'bookmarks':
        return <BookmarksPanel />;
      case 'tools':
        return <ToolsPanel />;
      case 'print':
        return <PrintPanel />;
      case 'advanced-search':
        return <AdvancedSearchPanel />;
      default:
        return (
          <div className="panel-content">
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--geovez-text-secondary)' }}>
              <CalciteIcon icon="information" scale="l" />
              <p style={{ marginTop: '1rem' }}>Select a panel from the navigation</p>
            </div>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (drawerContent) {
      case 'maps':
        return 'Maps';
      case 'layers':
        return 'Layers';
      case 'legend':
        return 'Legend';
      case 'bookmarks':
        return 'Bookmarks';
      case 'tools':
        return 'Tools';
      case 'print':
        return 'Print';
      case 'advanced-search':
        return 'Advanced Search';
      default:
        return 'Panel';
    }
  };

  const getIcon = () => {
    switch (drawerContent) {
      case 'maps':
        return 'map';
      case 'layers':
        return 'layers';
      case 'legend':
        return 'legend';
      case 'bookmarks':
        return 'bookmark';
      case 'tools':
        return 'apps';
      case 'print':
        return 'print';
      case 'advanced-search':
        return 'search';
      default:
        return 'panel';
    }
  };

  return (
    <CalcitePanel heading={getTitle()} className="modern-drawer">
      <CalciteAction
        slot="header-actions-end"
        icon="x"
        text="Close"
        onClick={handleClose}
      />
      <div className="panel-content">
        <div className="panel-header">
          <CalciteIcon icon={getIcon()} scale="m" />
          <h2 className="panel-title">{getTitle()}</h2>
        </div>
        <div className="drawer-content">
          {renderContent()}
        </div>
      </div>
    </CalcitePanel>
  );
};

export default Drawer;
