import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppStackParamList, Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import ChipSelector from '../components/ChipSelector';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { getErrorMessage } from '../utils/errors';
import { colors, spacing, typography, radius } from '../utils/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'TaskList'>;

type Filter = 'All' | 'Pending' | 'Completed';
const FILTERS: readonly Filter[] = ['All', 'Pending', 'Completed'];

const TaskListScreen = ({ navigation }: Props) => {
  const { user } = useAuth();
  const { tasks, loading, error, fetchTasks, completeTask, deleteTask } = useTasks();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('All');
  const [refreshing, setRefreshing] = useState(false);

  // Load tasks once when the screen mounts.
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, [fetchTasks]);

  const counts = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    return { total: tasks.length, completed, pending: tasks.length - completed };
  }, [tasks]);

  // Pending tasks first (soonest deadline on top), then completed ones (newest first).
  const visibleTasks = useMemo(() => {
    const filtered = filter === 'All' ? tasks : tasks.filter((t) => t.status === filter);
    return [...filtered].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'Pending' ? -1 : 1;
      if (a.status === 'Pending') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, filter]);

  const handleComplete = async (task: Task) => {
    try {
      await completeTask(task._id);
    } catch (e) {
      Alert.alert('Could not complete task', getErrorMessage(e));
    }
  };

  const handleDelete = (task: Task) => {
    Alert.alert('Delete task', `"${task.title}" will be permanently deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask(task._id);
          } catch (e) {
            Alert.alert('Could not delete task', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  const openForm = (task?: Task) => navigation.navigate('TaskForm', task ? { task } : undefined);

  // First load: full-screen spinner.
  if (loading && tasks.length === 0 && !refreshing) return <Loader />;

  // First load failed: show the error with a retry button.
  if (error && tasks.length === 0) {
    return (
      <View style={styles.errorScreen}>
        <ErrorBanner message={error} />
        <Button title="Try again" onPress={fetchTasks} />
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <Text style={styles.email} numberOfLines={1}>{user?.email}</Text>
      <Text style={styles.summary}>
        {counts.pending} pending, {counts.completed} completed
      </Text>
      <ErrorBanner message={error} />
      <ChipSelector options={FILTERS} value={filter} onChange={setFilter} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskCard task={item} onPress={openForm} onComplete={handleComplete} onDelete={handleDelete} />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          filter === 'All' ? (
            <EmptyState title="No tasks yet" message="Tap New task to add your first one." />
          ) : (
            <EmptyState title={`No ${filter.toLowerCase()} tasks`} message="Switch the filter to see the rest." />
          )
        }
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 96 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create a new task"
        onPress={() => openForm()}
        android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
        style={[styles.fab, { bottom: insets.bottom + spacing.md }]}>
        <Text style={styles.fabText}>New task</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.md },
  header: { paddingTop: spacing.sm, paddingBottom: spacing.md },
  email: { ...typography.caption },
  summary: { ...typography.title, fontSize: 24, marginTop: 2, marginBottom: spacing.md },
  errorScreen: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  fab: {
    position: 'absolute',
    right: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 15,
    paddingHorizontal: 24,
    elevation: 4,
  },
  fabText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
});

export default TaskListScreen;
