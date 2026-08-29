import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';
import { normalizeRedirectPath } from '../../utils/authRedirect';

const copyByFeature = {
  task: {
    kicker: 'Sign in required',
    title: 'Save tasks to your taskboard',
    body: 'Sign in with Google to add tasks, track progress, and pick up where you left off.'
  },
  share_edit: {
    kicker: 'Sign in required',
    title: 'Request edit access',
    body: 'Sign in with Google so the board owner can see your email and grant you permission to add or edit tasks.'
  },
  note: {
    kicker: 'Sign in required',
    title: 'Save notes to your noteboard',
    body: 'Sign in with Google to add sticky notes, edit them, and keep your boards.'
  },
  default: {
    kicker: 'Sign in required',
    title: 'Sign in to continue',
    body: 'Sign in with Google to save your work and use this feature.'
  }
};

const GoogleIcon = () => (
  <svg className="wb-signin-prompt-google-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3.5 14.5 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12S6.8 21.5 12 21.5c6.9 0 9.1-4.8 9.1-7.3 0-.5-.1-.9-.1-1.3H12Z"
    />
  </svg>
);

export const SignInPromptModal = ({
  open,
  onClose,
  onSignIn,
  feature = 'default'
}) => {
  const copy = copyByFeature[feature] || copyByFeature.default;

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="wb-confirm-backdrop wb-signin-prompt-backdrop" onClick={onClose}>
      <div
        className="wb-confirm wb-signin-prompt"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-in-prompt-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="wb-note-meta">{copy.kicker}</p>
        <h2 id="sign-in-prompt-title">{copy.title}</h2>
        <p className="wb-confirm-copy">{copy.body}</p>
        <div className="wb-signin-prompt-actions">
          <button type="button" className="wb-signin-prompt-google" onClick={onSignIn}>
            <GoogleIcon />
            Sign in with Google
          </button>
          <button type="button" className="wb-signin-prompt-dismiss" onClick={onClose}>
            Not now
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const useSignInPrompt = (feature = 'default') => {
  const { loginWithGoogle } = useAuth();
  const [open, setOpen] = useState(false);

  const requireSignIn = useCallback(() => {
    setOpen(true);
  }, []);

  const closeSignInPrompt = useCallback(() => {
    setOpen(false);
  }, []);

  const confirmSignIn = useCallback(() => {
    setOpen(false);
    const redirectPath = normalizeRedirectPath(
      `${window.location.pathname}${window.location.search}${window.location.hash}`
    );
    loginWithGoogle(redirectPath);
  }, [loginWithGoogle]);

  const signInPrompt = (
    <SignInPromptModal
      open={open}
      onClose={closeSignInPrompt}
      onSignIn={confirmSignIn}
      feature={feature}
    />
  );

  return { requireSignIn, signInPrompt };
};

export default SignInPromptModal;
