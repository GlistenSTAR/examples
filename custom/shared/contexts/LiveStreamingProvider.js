import React, {
  createContext,
  useContext,
  useCallback,
} from 'react';
import { useLiveStreaming as useDailyLiveStreaming } from '@daily-co/daily-react-hooks';
import PropTypes from 'prop-types';
import { useUIState } from './UIStateProvider';

export const LiveStreamingContext = createContext();

export const LiveStreamingProvider = ({ children }) => {
  const { setCustomCapsule } = useUIState();

  const handleStreamStarted = useCallback(() => {
    console.log('📺 Live stream started');
    setCustomCapsule({ variant: 'recording', label: 'Live streaming' });
  }, [setCustomCapsule]);

  const handleStreamStopped = useCallback(() => {
    console.log('📺 Live stream stopped');
    setCustomCapsule(null);
  }, [setCustomCapsule]);

  const handleStreamError = useCallback(
    (e) => {
      console.log('📺 Live stream error ' + e.errorMsg);
      setCustomCapsule(null);
    },
    [setCustomCapsule]
  );

  const {
    isLiveStreaming,
    layout,
    errorMsg,
    startLiveStreaming,
    updateLiveStreaming,
    stopLiveStreaming
  } = useDailyLiveStreaming({
    onLiveStreamingStarted: handleStreamStarted,
    onLiveStreamingStopped: handleStreamStopped,
    onLiveStreamingError: handleStreamError,
  });

  return (
    <LiveStreamingContext.Provider
      value={{
        isStreaming: isLiveStreaming,
        streamError: errorMsg,
        layout,
        startLiveStreaming,
        updateLiveStreaming,
        stopLiveStreaming,
    }}>
      {children}
    </LiveStreamingContext.Provider>
  );
};

LiveStreamingProvider.propTypes = {
  children: PropTypes.node,
};

export const useLiveStreaming = () => useContext(LiveStreamingContext);
