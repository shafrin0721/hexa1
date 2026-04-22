import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api';

const AvatarContext = createContext(undefined);

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    // Return a safe fallback instead of throwing or warning
    console.warn('useAvatar was called outside of AvatarProvider. Using fallback values.');
    return { 
      avatarUrl: null, 
      updateAvatar: () => {}, 
      userEmail: null, 
      isLoading: false,
      isFallback: true 
    };
  }
  return context;
};

export const AvatarProvider = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAvatar = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const email = user?.email;
          setUserEmail(email);
          
          if (email) {
            const avatarKey = `hexal_profile_avatar:${email.toLowerCase()}`;
            const localAvatar = localStorage.getItem(avatarKey);
            
            if (localAvatar && localAvatar.startsWith('data:')) {
              setAvatarUrl(localAvatar);
            } else {
              try {
                const res = await fetch(`${apiUrl("/api/profile")}?email=${encodeURIComponent(email)}`);
                if (res.ok) {
                  const profile = await res.json();
                  if (profile.profile_photo && profile.profile_photo.startsWith('data:')) {
                    setAvatarUrl(profile.profile_photo);
                    localStorage.setItem(avatarKey, profile.profile_photo);
                  }
                }
              } catch (error) {
                console.error('Error fetching profile avatar:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAvatar();
  }, []);

  const updateAvatar = (newAvatar, email) => {
    setAvatarUrl(newAvatar);
    if (email) {
      const avatarKey = `hexal_profile_avatar:${email.toLowerCase()}`;
      if (newAvatar && newAvatar.startsWith('data:')) {
        localStorage.setItem(avatarKey, newAvatar);
      } else {
        localStorage.removeItem(avatarKey);
      }
    }
  };

  const value = {
    avatarUrl,
    updateAvatar,
    userEmail,
    isLoading,
  };

  return React.createElement(AvatarContext.Provider, { value }, children);
};

export default AvatarProvider;