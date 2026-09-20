import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { formatDate, formatTime } from '../utils/date';
import { colors, radius } from '../utils/theme';

interface Props {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  minimumDate?: Date;
}

/**
 * Deadline picker. Android shows two native dialogs back to back:
 * first the date, then the time. The result is combined into one Date.
 */
const DatePickerField = ({ label, value, onChange, error, minimumDate }: Props) => {
  const open = () => {
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      minimumDate,
      onChange: (dateEvent, pickedDate) => {
        if (dateEvent.type !== 'set' || !pickedDate) return; // user cancelled

        DateTimePickerAndroid.open({
          value: pickedDate,
          mode: 'time',
          is24Hour: false,
          onChange: (timeEvent, pickedTime) => {
            if (timeEvent.type !== 'set' || !pickedTime) return;
            const result = new Date(pickedDate);
            result.setHours(pickedTime.getHours(), pickedTime.getMinutes(), 0, 0);
            onChange(result);
          },
        });
      },
    });
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${formatDate(value)} at ${formatTime(value)}. Tap to change`}
        onPress={open}
        style={[styles.field, !!error && styles.fieldError]}>
        <Text style={styles.date}>{formatDate(value)}</Text>
        <Text style={styles.time}>{formatTime(value)}</Text>
      </Pressable>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 6 },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  fieldError: { borderColor: colors.danger },
  date: { fontSize: 16, color: colors.ink },
  time: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  error: { color: colors.danger, fontSize: 13, marginTop: 6 },
});

export default DatePickerField;
