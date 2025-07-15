import React from 'react';
import { CalciteLink, CalciteIcon } from '@esri/calcite-components-react';

interface FooterProps {
  config: {
    socialLinks: {
      contactUs?: string;
      feedback?: string;
      twitter?: string;
      linkedin?: string;
      facebook?: string;
    };
  };
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  const { socialLinks } = config;
  
  return (
    <footer slot="footer" className="modern-footer">
      <div className="footer-content">
        <div className="footer-links">
          {socialLinks.contactUs && (
            <CalciteLink href={socialLinks.contactUs} className="footer-link">
              <CalciteIcon icon="user" scale="s" />
              Contact Us
            </CalciteLink>
          )}
          {socialLinks.feedback && (
            <CalciteLink href={socialLinks.feedback} className="footer-link">
              <CalciteIcon icon="speech-bubble-social" scale="s" />
              Give Us Feedback
            </CalciteLink>
          )}
        </div>
        
        <div className="footer-social">
          {socialLinks.twitter && (
            <CalciteLink href={socialLinks.twitter} target="_blank" className="social-link">
              <CalciteIcon icon="link-external" scale="s" />
            </CalciteLink>
          )}
          {socialLinks.linkedin && (
            <CalciteLink href={socialLinks.linkedin} target="_blank" className="social-link">
              <CalciteIcon icon="link-external" scale="s" />
            </CalciteLink>
          )}
          {socialLinks.facebook && (
            <CalciteLink href={socialLinks.facebook} target="_blank" className="social-link">
              <CalciteIcon icon="link-external" scale="s" />
            </CalciteLink>
          )}
        </div>
        
        <div className="footer-copyright">
          <p>&copy; 2025 GeoVez. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
