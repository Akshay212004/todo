import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types';
import { formatDate, formatDateTime, isOverdue } from '../utils/date';
import { colors, priorityColors, radius } from '../utils/theme';

interface Props {
  task: Task;
  onPress: (task: Task) => void;
  onComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/**
 * One task row. The stripe on the left edge is the priority colour, so priority
 * can be scanned down the list without reading the badge.
 */
const TaskCard = ({ task, onPress, onComplete, onDelete }: Props) => {
  const done = task.status === 'Completed';
  const overdue = isOverdue(task.deadline, task.status);
  const priority = priorityColors[task.priority];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Edit task ${task.title}`}
      onPress={() => onPress(task)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.stripe, { backgroundColor: done ? colors.border : priority.solid }]} />

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={done ? 'Task completed' : 'Mark task as completed'}
        hitSlop={10}
        disabled={done}
        onPress={() => onComplete(task)}
        style={[styles.checkbox, done && styles.checkboxDone]}>
        {done && <Text style={styles.tick}>✓</Text>}
      </Pressable>

      <View style={styles.body}>
        <Text style={[styles.title, done && styles.titleDone]} numberOfLines={2}>
          {task.title}
        </Text>

        {!!task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: priority.tint }]}>
            <Text style={[styles.badgeText, { color: priority.solid }]}>{task.priority}</Text>
          </View>
          <Text style={[styles.meta, overdue && styles.overdue]}>
            {overdue ? 'Overdue · ' : 'Due '}
            {formatDateTime(task.deadline)}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.created}>Created {formatDate(task.createdAt)}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Delete task ${task.title}`}
            hitSlop={10}
            onPress={() => onDelete(task)}>
            <Text style={styles.delete}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: 12,
    paddingVertical: 14,
    paddingRight: 14,
    paddingLeft: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.85 },
  stripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  checkboxDone: { backgroundColor: colors.success, borderColor: colors.success },
  tick: { color: colors.onPrimary, fontSize: 15, fontWeight: '700', marginTop: -1 },
  body: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: colors.ink },
  titleDone: { textDecorationLine: 'line-through', color: colors.muted },
  description: { fontSize: 14, color: colors.muted, marginTop: 4, lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  badgeText: { fontSize: 12, fontWeight: '700' },
  meta: { fontSize: 13, color: colors.muted },
  overdue: { color: colors.danger, fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  created: { fontSize: 12, color: colors.muted },
  delete: { fontSize: 13, fontWeight: '600', color: colors.danger },
});

export default TaskCard;
