import React from 'react';
import Joyride, { type Step } from 'react-joyride';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { endHelpTour } from '../../store/slices/uiSlice';
import type { RootState } from '../../store';

const HelpTour: React.FC = () => {
  const dispatch = useAppDispatch();
  const ui = useAppSelector((state: RootState) => state.ui);
  const helpTourActive = ui?.helpTourActive;

  const steps: Step[] = [
    {
      target: '[data-tour="navigation"]',
      content: 'Use the navigation menu to access different features like Maps, Layers, and Tools.',
      placement: 'right',
    },
    {
      target: '[data-tour="maps"]',
      content: 'Click here to browse and select different web maps.',
      placement: 'right',
    },
    {
      target: '[data-tour="layers"]',
      content: 'Manage map layers and their visibility here.',
      placement: 'right',
    },
    {
      target: '[data-tour="legend"]',
      content: 'View the map legend to understand symbology.',
      placement: 'right',
    },
    {
      target: '[data-tour="map-container"]',
      content: 'This is your main map view. You can zoom, pan, and interact with the map here.',
      placement: 'center',
    },
    {
      target: '[data-tour="sign-in"]',
      content: 'Sign in to access your personal maps and data.',
      placement: 'left',
    },
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
      dispatch(endHelpTour());
    }
  };

  return (
    null
    // <Joyride
    //   steps={steps}
    //   run={helpTourActive}
    //   continuous={true}
    //   showProgress={true}
    //   showSkipButton={true}
    //   callback={handleJoyrideCallback}
    //   styles={{
    //     options: {
    //       primaryColor: '#0079C1',
    //     }
    //   }}
    // />
  );
};

export default HelpTour;
