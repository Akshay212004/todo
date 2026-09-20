import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { TaskProvider } from '../context/TaskContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import Loader from '../components/Loader';

/**
 * Chooses between the two navigators based on the auth state.
 *  - still reading AsyncStorage  -> spinner (avoids flashing the login screen)
 *  - token present               -> app screens, wrapped in TaskProvider
 *  - no token                    -> login / register
 * Because the branches swap, logging in or out resets navigation history automatically.
 */
const RootNavigator = () => {
  const { token, isBootstrapping } = useAuth();

  if (isBootstrapping) return <Loader />;

  return (
    <NavigationContainer>
      {token ? (
        <TaskProvider>
          <AppNavigator />
        </TaskProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
