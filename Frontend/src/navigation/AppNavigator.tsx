import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';
import TaskListScreen from '../screens/TaskListScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import LogoutButton from '../components/LogoutButton';
import { colors } from '../utils/theme';

const Stack = createNativeStackNavigator<AppStackParamList>();

/** Screens available while logged in. */
const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerShadowVisible: false,
      headerTintColor: colors.ink,
      headerTitleStyle: { fontWeight: '700' },
      contentStyle: { backgroundColor: colors.background },
    }}>
    <Stack.Screen
      name="TaskList"
      component={TaskListScreen}
      options={{ title: 'My tasks', headerRight: () => <LogoutButton /> }}
    />
    <Stack.Screen
      name="TaskForm"
      component={TaskFormScreen}
      options={({ route }) => ({ title: route.params?.task ? 'Edit task' : 'New task' })}
    />
  </Stack.Navigator>
);

export default AppNavigator;
