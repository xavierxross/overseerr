import React, { useState } from 'react';
import PlexOAuth from '../../utils/plex';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  loginwithplex: 'Login with Plex',
  loading: 'Loading...',
  loggingin: 'Logging in...',
});

const plexOAuth = new PlexOAuth();

interface PlexLoginButtonProps {
  onAuthToken: (authToken: string) => void;
  onError?: (message: string) => void;
}

const PlexLoginButton: React.FC<PlexLoginButtonProps> = ({
  onAuthToken,
  onError,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getPlexLogin = async () => {
    setLoading(true);
    try {
      const authToken = await plexOAuth.login();
      setLoading(false);
      setIsProcessing(true);
      onAuthToken(authToken);
    } catch (e) {
      if (onError) {
        onError(e.message);
      }
      setLoading(false);
    }
  };
  return (
    <span className="block w-full rounded-md shadow-sm">
      <button
        type="button"
        onClick={() => {
          plexOAuth.preparePopup();
          setTimeout(() => getPlexLogin(), 1500);
        }}
        disabled={loading || isProcessing}
        className="plex-button"
      >
        {loading
          ? intl.formatMessage(messages.loading)
          : isProcessing
          ? intl.formatMessage(messages.loggingin)
          : intl.formatMessage(messages.loginwithplex)}
      </button>
    </span>
  );
};

export default PlexLoginButton;
