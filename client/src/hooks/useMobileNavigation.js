import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useMobileNavigation = (selectedUser, setSelectedUser) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationStack = useRef([]);
  const isMobile = window.innerWidth <= 639;

  // Initialize navigation stack
  useEffect(() => {
    if (isMobile) {
      navigationStack.current = [location.pathname];
    }
  }, [location.pathname, isMobile]);

  // Handle browser back button
  useEffect(() => {
    if (!isMobile) return;

    const handlePopState = (event) => {
      // If we're in a chat and user presses back, go to users list
      if (selectedUser) {
        event.preventDefault();
        setSelectedUser(null);
        // Update URL without adding to history
        window.history.pushState({ chat: false }, '', '/');
        return;
      }

      // If we're on profile page and user presses back, go to home
      if (location.pathname === '/profile') {
        event.preventDefault();
        navigate('/');
        return;
      }

      // If we're on home page and user presses back, show exit confirmation
      if (location.pathname === '/') {
        event.preventDefault();
        if (window.confirm('Do you want to exit the app?')) {
          // Try to close the window/tab
          window.close();
          // If window.close() doesn't work, try to navigate away
          window.location.href = 'about:blank';
        } else {
          // Push current state back to prevent exit
          window.history.pushState(null, '', '/');
        }
        return;
      }
    };

    // Handle beforeunload for exit confirmation
    const handleBeforeUnload = (event) => {
      if (location.pathname === '/') {
        const message = 'Do you want to exit the app?';
        event.returnValue = message;
        return message;
      }
    };

    // Handle visibility change (when user switches tabs/apps)
    const handleVisibilityChange = () => {
      if (document.hidden && location.pathname === '/') {
        // User switched away from the app
        // We could save state here if needed
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedUser, location.pathname, navigate, setSelectedUser, isMobile]);

  // Handle programmatic navigation
  const navigateToChat = (user) => {
    if (isMobile) {
      setSelectedUser(user);
      // Update URL to reflect chat state
      window.history.pushState({ chat: true, userId: user._id }, '', `/chat/${user._id}`);
    } else {
      setSelectedUser(user);
    }
  };

  const navigateToUsers = () => {
    if (isMobile) {
      setSelectedUser(null);
      // Update URL to reflect users list state
      window.history.pushState({ chat: false }, '', '/');
    } else {
      setSelectedUser(null);
    }
  };

  const navigateToProfile = () => {
    if (isMobile) {
      navigate('/profile');
    } else {
      navigate('/profile');
    }
  };

  // Handle swipe back gesture (for iOS Safari)
  useEffect(() => {
    if (!isMobile) return;

    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = false;
    };

    const handleTouchMove = (e) => {
      if (!startX || !startY) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = Math.abs(startY - currentY);

      // Check if it's a horizontal swipe from left edge
      if (diffX > 50 && diffY < 100 && startX < 50) {
        isSwiping = true;
      }
    };

    const handleTouchEnd = (e) => {
      if (isSwiping) {
        // Simulate back button press
        window.history.back();
      }
      startX = 0;
      startY = 0;
      isSwiping = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  return {
    navigateToChat,
    navigateToUsers,
    navigateToProfile,
    isMobile
  };
}; 