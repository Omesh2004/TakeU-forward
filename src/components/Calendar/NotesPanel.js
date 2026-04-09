"use client";

import { useRef, useState, useEffect } from 'react';
import styles from './Calendar.module.css';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
}

/* ──────────────────────────────────────────────── */
/*  Range Context Banner                             */
/* ──────────────────────────────────────────────── */

function RangeContextBanner({ ranges }) {
  if (!ranges || ranges.length === 0) return null;

  return (
    <div className={styles.rangeContextList}>
      {ranges.map((range, index) => {
        const memos = Array.isArray(range.memo) ? range.memo : [];
        return (
          <div key={index} className={styles.rangeContextBanner}>
            <div className={styles.rangeContextIcon}>🗓</div>
            <div className={styles.rangeContextBody}>
              <span className={styles.rangeContextLabel}>{range.label}</span>
              {memos.length > 0 ? (
                <div className={styles.rangeContextMemos}>
                  {memos.map((m) => (
                    <span key={m.id} className={styles.rangeContextMemo}>"{m.text}"</span>
                  ))}
                </div>
              ) : (
                <span className={styles.rangeContextEmpty}>No memo for this range</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────── */
/*  Memo Item                                        */
/* ──────────────────────────────────────────────── */

function MemoItem({ memo, onRemove }) {
  return (
    <div className={styles.memoItem}>
      <div className={styles.memoItemContent}>
        <span className={styles.memoItemText}>{memo.text}</span>
        <span className={styles.memoItemTime}>{formatTime(memo.createdAt)}</span>
      </div>
      <button
        type="button"
        className={styles.memoItemRemove}
        onClick={() => onRemove(memo.id)}
        aria-label="Remove memo"
        title="Remove memo"
      >
        ×
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────── */
/*  Memo Set (input + list)                          */
/* ──────────────────────────────────────────────── */

function MemoSet({ memos, onAdd, onRemove, placeholder, label }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Auto-scroll to bottom when new memo is added
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [memos?.length]);

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitMemo();
    }
  }

  function submitMemo() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    onAdd({
      id: generateId(),
      text: trimmed,
      createdAt: new Date().toISOString()
    });
    setInputValue('');
    inputRef.current?.focus();
  }

  const safeMemos = Array.isArray(memos) ? memos : [];

  return (
    <div className={styles.memoSetSection}>
      <span className={styles.memoLabel}>{label}</span>

      {safeMemos.length > 0 && (
        <div className={styles.memoSetList} ref={listRef}>
          {safeMemos.map((memo) => (
            <MemoItem key={memo.id} memo={memo} onRemove={onRemove} />
          ))}
        </div>
      )}

      {safeMemos.length === 0 && (
        <div className={styles.memoSetEmpty}>
          <span>No memos yet — type below and press Enter</span>
        </div>
      )}

      <div className={styles.memoInputRow}>
        <input
          ref={inputRef}
          type="text"
          className={styles.memoInput}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="New memo"
          maxLength={500}
        />
        <button
          type="button"
          className={styles.memoAddButton}
          onClick={submitMemo}
          disabled={!inputValue.trim()}
        >
          ↵ Save
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────── */
/*  Task Item                                        */
/* ──────────────────────────────────────────────── */

function TaskItem({ task, onToggle, onRemove }) {
  return (
    <div className={`${styles.taskItem} ${task.done ? styles.taskDone : ''}`}>
      <button
        type="button"
        className={styles.taskCheckbox}
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
        data-checked={task.done}
      >
        {task.done ? '✓' : ''}
      </button>
      <span className={styles.taskText}>{task.text}</span>
      <button
        type="button"
        className={styles.taskRemove}
        onClick={() => onRemove(task.id)}
        aria-label="Remove task"
        title="Remove task"
      >
        ×
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────── */
/*  Task List                                        */
/* ──────────────────────────────────────────────── */

function TaskList({ tasks, onAdd, onToggle, onRemove }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    onAdd({ id: generateId(), text: trimmed, done: false });
    setInputValue('');
    inputRef.current?.focus();
  }

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className={styles.taskSection}>
      <div className={styles.taskHeader}>
        <span className={styles.taskTitle}>Tasks</span>
        {tasks.length > 0 && (
          <span className={styles.taskProgress}>
            {completedCount}/{tasks.length} done
          </span>
        )}
      </div>

      {tasks.length > 0 && (
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}

      <form className={styles.taskInputRow} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className={styles.taskInput}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Add a task…"
          aria-label="New task"
          maxLength={200}
        />
        <button
          type="submit"
          className={styles.taskAddButton}
          disabled={!inputValue.trim()}
        >
          + Add
        </button>
      </form>
    </div>
  );
}

/* ──────────────────────────────────────────────── */
/*  Main Notes Panel                                 */
/* ──────────────────────────────────────────────── */

export default function NotesPanel({
  // Mode
  mode, // 'month' | 'day' | 'range'

  // Month view
  monthLabel,
  monthMemos,
  onAddMonthMemo,
  onRemoveMonthMemo,

  // Day view
  selectedDateLabel,
  dayMemos,
  onAddDayMemo,
  onRemoveDayMemo,
  dayTasks,
  onAddTask,
  onToggleTask,
  onRemoveTask,
  rangeContext,

  // Range view
  rangeLabel,
  rangeMemos,
  onAddRangeMemo,
  onRemoveRangeMemo,

  // Common
  savedAt,
  visibleHolidayCount
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(false);
  }, [mode, selectedDateLabel, rangeLabel]);

  // Determine panel content based on mode
  let title = '';
  let subtitle = '';
  let memoList = [];
  let onAddMemo = null;
  let onRemoveMemo = null;
  let placeholder = '';
  let memoLabel = '';
  let showTasks = false;

  if (mode === 'day') {
    title = selectedDateLabel;
    subtitle = rangeContext && rangeContext.length > 0
      ? `Part of ${rangeContext.length} range${rangeContext.length > 1 ? 's' : ''}`
      : 'Single day selected';
    memoList = dayMemos;
    onAddMemo = onAddDayMemo;
    onRemoveMemo = onRemoveDayMemo;
    placeholder = 'Write a memo for this day and press Enter…';
    memoLabel = 'Day Memos';
    showTasks = true;
  } else if (mode === 'range') {
    title = rangeLabel;
    subtitle = 'Range selected — shift+click to adjust';
    memoList = rangeMemos;
    onAddMemo = onAddRangeMemo;
    onRemoveMemo = onRemoveRangeMemo;
    placeholder = 'Write a memo for this range and press Enter…';
    memoLabel = 'Range Memos';
  } else {
    title = monthLabel;
    subtitle = 'General memo for the current month';
    memoList = monthMemos;
    onAddMemo = onAddMonthMemo;
    onRemoveMemo = onRemoveMonthMemo;
    placeholder = 'Write a month memo and press Enter…';
    memoLabel = 'Month Memos';
  }

  const safeMemoList = Array.isArray(memoList) ? memoList : [];
  const memoCount = safeMemoList.length;

  return (
    <section
      className={styles.notesPanel}
      data-collapsed={collapsed}
      data-mode={mode}
      aria-label="Notes panel"
    >
      <div className={styles.notesHeader}>
        <div className={styles.notesTitleBlock}>
          <p className={styles.notesEyebrow}>
            {mode === 'day' ? '📌 Day Notes' : mode === 'range' ? '📅 Range Notes' : '📝 Notes'}
          </p>
          <h3 className={styles.notesTitle}>{title}</h3>
          <p className={styles.notesSummary}>{subtitle}</p>
        </div>

        <button
          type="button"
          className={`${styles.toggleButton} ${styles.drawerToggle}`}
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? '▼ Open' : '▲ Close'}
        </button>
      </div>

      <div className={styles.notesStack}>
        {/* Range context: show when a single day falls within saved ranges */}
        {mode === 'day' && <RangeContextBanner ranges={rangeContext} />}

        {/* Memo set: input + displayed list */}
        <MemoSet
          memos={memoList}
          onAdd={onAddMemo}
          onRemove={onRemoveMemo}
          placeholder={placeholder}
          label={memoLabel}
        />

        {/* Task list: only in day view */}
        {showTasks && (
          <TaskList
            tasks={dayTasks}
            onAdd={onAddTask}
            onToggle={onToggleTask}
            onRemove={onRemoveTask}
          />
        )}

        <div className={styles.notesFooter}>
          <div className={styles.notesStatus}>
            <span className={styles.statusDot} />
            <span>{savedAt ? 'Saved just now' : 'Saved in browser'}</span>
          </div>

          <div className={styles.notesCounter}>
            {memoCount} memo{memoCount !== 1 ? 's' : ''}
            {showTasks && dayTasks.length > 0 && ` · ${dayTasks.length} task${dayTasks.length !== 1 ? 's' : ''}`}
            {visibleHolidayCount > 0 && ` · ${visibleHolidayCount} holiday${visibleHolidayCount === 1 ? '' : 's'}`}
          </div>
        </div>
      </div>
    </section>
  );
}
