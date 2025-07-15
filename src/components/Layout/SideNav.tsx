import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { openDrawer } from '../../store/slices/uiSlice';
import { startHelpTour } from '../../store/slices/uiSlice';
import type { RootState } from '../../store';
import { 
  CalciteNavigation,
  CalciteNavigationUser,
  CalciteMenu,
  CalciteMenuItem,
  CalciteIcon
} from '@esri/calcite-components-react';

const SideNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);
  const ui = useAppSelector((state: RootState) => state.ui);
  const { user, isAuthenticated } = auth || {};
  const { drawerContent } = ui || {};

  const navigationItems = [
    { id: 'advanced-search', icon: 'search', text: 'Advanced Search' },
    { id: 'maps', icon: 'map', text: 'Maps' },
    { id: 'layers', icon: 'layers', text: 'Layers' },
    { id: 'legend', icon: 'legend', text: 'Legend' },
    { id: 'bookmarks', icon: 'bookmark', text: 'Bookmarks' },
    { id: 'tools', icon: 'apps', text: 'Tools' },
    { id: 'print', icon: 'print', text: 'Print' },
  ];

  const handleNavigation = (id: string) => {
    if (id === 'help') {
      dispatch(startHelpTour());
    } else {
      dispatch(openDrawer(id as any));
    }
  };

  return (
    <div className="modern-sidenav" data-tour="navigation">
      {/* {isAuthenticated && user && (
        <CalciteNavigationUser 
          slot="user" 
          fullName={user.fullName || user.username} 
          username={user.username}
        />
      )} */}

      <CalciteMenu layout="vertical">
        {navigationItems.map((item) => (
          <CalciteMenuItem
            key={item.id}
            text={item.text}
            iconStart={item.icon}
            textEnabled
            active={drawerContent === item.id}
            onClick={() => handleNavigation(item.id)}
            data-tour={item.id}
          />
        ))}
        
        <CalciteMenuItem
          text="Help"
          iconStart="information"
          textEnabled
          onClick={() => handleNavigation('help')}
        />
      </CalciteMenu>
    </div>
  );
};

export default SideNav;
