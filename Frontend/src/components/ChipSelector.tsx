import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../utils/theme';

interface Props<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** Optional per-option accent colours (used for priority). */
  accent?: Partial<Record<T, { solid: string; tint: string }>>;
  /** Optional text shown instead of the raw option value. */
  renderLabel?: (option: T) => string;
}

/** Single-choice pill group. Used for priority, status and the list filter. */
function ChipSelector<T extends string>({ options, value, onChange, accent, renderLabel }: Props<T>) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option === value;
        const solid = accent?.[option]?.solid ?? colors.primary;
        const tint = accent?.[option]?.tint ?? colors.primaryTint;

        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option)}
            style={[
              styles.chip,
              selected && { backgroundColor: tint, borderColor: solid },
            ]}>
            <Text style={[styles.label, selected && { color: solid, fontWeight: '700' }]}>
              {renderLabel ? renderLabel(option) : option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  label: { fontSize: 14, color: colors.muted, fontWeight: '500' },
});

export default ChipSelector;
