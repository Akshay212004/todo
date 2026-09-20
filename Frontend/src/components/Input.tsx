import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  /** Shows a Show/Hide toggle and masks the text. */
  isPassword?: boolean;
}

const Input = ({ label, error, isPassword = false, style, multiline, ...rest }: Props) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.field,
          multiline && styles.fieldMultiline,
          focused && styles.fieldFocused,
          !!error && styles.fieldError,
        ]}>
        <TextInput
          placeholderTextColor={colors.muted}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          secureTextEntry={isPassword && hidden}
          accessibilityLabel={label}
          {...rest}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, multiline && styles.inputMultiline, style]}
        />
        {isPassword && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Text style={styles.toggle}>{hidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: { fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 6 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
  },
  fieldMultiline: { alignItems: 'flex-start' },
  fieldFocused: { borderColor: colors.primary },
  fieldError: { borderColor: colors.danger },
  input: { flex: 1, minHeight: 50, fontSize: 16, color: colors.ink, paddingVertical: 10 },
  inputMultiline: { minHeight: 100 },
  toggle: { color: colors.primary, fontWeight: '600', fontSize: 14, paddingLeft: 10 },
  error: { color: colors.danger, fontSize: 13, marginTop: 6 },
});

export default Input;
