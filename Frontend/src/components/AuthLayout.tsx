import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../utils/theme';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Shared page shell for Login and Register. */
const AuthLayout = ({ title, subtitle, children }: Props) => (
  <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {children}
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  header: { marginBottom: spacing.xl },
  title: { ...typography.title, fontSize: 32 },
  subtitle: { ...typography.body, color: colors.muted, marginTop: 8, lineHeight: 22 },
});

export default AuthLayout;
