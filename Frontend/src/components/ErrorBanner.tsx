import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';

/** Inline error message for failed API calls. Renders nothing when there is no message. */
const ErrorBanner = ({ message }: { message?: string | null }) => {
  if (!message) return null;
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.dangerTint,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: spacing.md,
  },
  text: { color: colors.danger, fontSize: 14, lineHeight: 20 },
});

export default ErrorBanner;
