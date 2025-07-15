import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleSideNav } from '../../store/slices/uiSlice';
import { 
  CalciteAction, 
  CalciteButton, 
  CalciteIcon,
  CalciteNavigation,
  CalciteNavigationLogo
} from '@esri/calcite-components-react';

interface HeaderProps {
  onSignInClick: () => void;
  config: {
    appTitle: string;
    logoUrl: string;
    theme: {
      primary: string;
    };
  };
}

const Header: React.FC<HeaderProps> = ({ onSignInClick, config }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleMenuToggle = () => {
    dispatch(toggleSideNav());
  };

  return (
    <CalciteNavigation slot="header" navigationAction={true} className="modern-header">
      <CalciteAction
        slot="navigation-action"
        text="Menu"
        icon="hamburger"
        onClick={handleMenuToggle}
      />
      
      <CalciteNavigationLogo
        slot="logo"
        thumbnail={config.logoUrl}
        heading={config.appTitle}
        className="modern-logo"
      />

      <div slot="content-end" className="header-actions">
        {isAuthenticated ? (
          <div className="user-info">
            <CalciteIcon icon="user" scale="s" />
            <span className="username">{user?.fullName || user?.username}</span>
          </div>
        ) : (
          <CalciteButton 
            onClick={onSignInClick}
            iconStart="sign-in"
            kind="brand"
            className="sign-in-button"
            data-tour="sign-in"
          >
            Sign In
          </CalciteButton>
        )}
      </div>
    </CalciteNavigation>
  );
};

export default Header;
