import React from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/theme';

/** Header button that asks for confirmation before signing out. */
const LogoutButton = () => {
  const { logout } = useAuth();

  const confirm = () =>
    Alert.alert('Sign out', 'You will need to sign in again to see your tasks.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);

  return (
    <Pressable accessibilityRole="button" onPress={confirm} hitSlop={10}>
      <Text style={styles.text}>Sign out</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: { color: colors.primary, fontSize: 15, fontWeight: '600' },
});

export default LogoutButton;
