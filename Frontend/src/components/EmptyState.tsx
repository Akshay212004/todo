import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../utils/theme';

interface Props {
  title: string;
  message: string;
}

const EmptyState = ({ title, message }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 64, paddingHorizontal: spacing.lg },
  title: { ...typography.heading, marginBottom: 6 },
  message: { ...typography.body, color: colors.muted, textAlign: 'center', lineHeight: 22 },
});

export default EmptyState;
