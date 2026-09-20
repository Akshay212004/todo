import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '../utils/theme';

/** Centered spinner that fills its parent. */
const Loader = () => (
  <View style={styles.container} accessibilityLabel="Loading">
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});

export default Loader;
