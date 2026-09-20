import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, PRIORITIES, Priority, STATUSES, TaskStatus } from '../types';
import { useTasks } from '../context/TaskContext';
import Input from '../components/Input';
import Button from '../components/Button';
import ChipSelector from '../components/ChipSelector';
import DatePickerField from '../components/DatePickerField';
import ErrorBanner from '../components/ErrorBanner';
import { defaultDeadline } from '../utils/date';
import { validateDeadline, validateDescription, validateTitle } from '../utils/validators';
import { getErrorMessage } from '../utils/errors';
import { colors, priorityColors, spacing } from '../utils/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'TaskForm'>;

interface FormErrors {
  title?: string;
  description?: string;
  deadline?: string;
}

/**
 * Create and edit share this screen: if a `task` param is passed we are editing.
 */
const TaskFormScreen = ({ navigation, route }: Props) => {
  const editingTask = route.params?.task;
  const isNew = !editingTask;
  const { createTask, updateTask } = useTasks();

  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [description, setDescription] = useState(editingTask?.description ?? '');
  const [deadline, setDeadline] = useState<Date>(
    editingTask ? new Date(editingTask.deadline) : defaultDeadline()
  );
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'Medium');
  const [status, setStatus] = useState<TaskStatus>(editingTask?.status ?? 'Pending');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const nextErrors: FormErrors = {
      title: validateTitle(title),
      description: validateDescription(description),
      deadline: validateDeadline(deadline, isNew),
    };
    setErrors(nextErrors);
    if (nextErrors.title || nextErrors.description || nextErrors.deadline) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      deadline: deadline.toISOString(),
      priority,
    };

    setApiError(null);
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, { ...payload, status });
      } else {
        await createTask(payload);
      }
      navigation.goBack();
    } catch (error) {
      setApiError(getErrorMessage(error));
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <ErrorBanner message={apiError} />

      <Input
        label="Title"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
        }}
        error={errors.title}
        placeholder="What needs to be done?"
        maxLength={100}
        returnKeyType="next"
      />

      <Input
        label="Description (optional)"
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          if (errors.description) setErrors((e) => ({ ...e, description: undefined }));
        }}
        error={errors.description}
        placeholder="Add details, links, or notes"
        multiline
        maxLength={500}
      />

      <DatePickerField
        label="Deadline"
        value={deadline}
        onChange={(date) => {
          setDeadline(date);
          setErrors((e) => ({ ...e, deadline: undefined }));
        }}
        error={errors.deadline}
        minimumDate={isNew ? new Date() : undefined}
      />

      <View style={styles.group}>
        <Text style={styles.groupLabel}>Priority</Text>
        <ChipSelector options={PRIORITIES} value={priority} onChange={setPriority} accent={priorityColors} />
      </View>

      {!isNew && (
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Status</Text>
          <ChipSelector options={STATUSES} value={status} onChange={setStatus} />
        </View>
      )}

      <Button
        title={isNew ? 'Save task' : 'Save changes'}
        onPress={handleSave}
        loading={saving}
        style={styles.save}
      />
      <Button title="Cancel" variant="outline" onPress={() => navigation.goBack()} disabled={saving} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  group: { marginBottom: spacing.lg },
  groupLabel: { fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 8 },
  save: { marginBottom: 12, marginTop: 4 },
});

export default TaskFormScreen;
