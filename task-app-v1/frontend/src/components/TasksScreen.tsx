import { parseDate } from "@internationalized/date";
import {
  Button,
  Checkbox,
  DateInput,
  Spinner,
} from "@nextui-org/react";
import { ArrowLeft, Edit, Minus, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "../AppProvider";
import Task from "../domain/Task";
import { TaskStatus } from "../domain/TaskStatus";
import { TaskPriority } from "../domain/TaskPriority";

const priorityStyles: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: "bg-[#e8b4b4]",
  [TaskPriority.MEDIUM]: "bg-[#e0c890]",
  [TaskPriority.LOW]: "bg-[#a8c9b8]",
};

const TaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const taskList = state.taskLists.find((tl) => listId === tl.id);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!listId) return;

      setIsLoading(true);
      try {
        if (!taskList) {
          await api.getTaskList(listId);
        }

        try {
          await api.fetchTasks(listId);
        } catch {
          console.log("Tasks not available yet");
        }
      } catch (error) {
        console.error("Error loading task list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [listId]);

  const completionPercentage = React.useMemo(() => {
    if (listId && state.tasks[listId]) {
      const tasks = state.tasks[listId];
      const closeTaskCount = tasks.filter(
        (task) => task.status === TaskStatus.CLOSED
      ).length;
      return tasks.length > 0 ? (closeTaskCount / tasks.length) * 100 : 0;
    }
    return 0;
  }, [state.tasks, listId]);

  const toggleStatus = (task: Task) => {
    if (listId) {
      const updatedTask = { ...task };
      updatedTask.status =
        task.status === TaskStatus.CLOSED ? TaskStatus.OPEN : TaskStatus.CLOSED;

      api
        .updateTask(listId, task.id!, updatedTask)
        .then(() => api.fetchTasks(listId));
    }
  };

  const deleteTaskList = async () => {
    if (null != listId) {
      await api.deleteTaskList(listId);
      navigate("/");
    }
  };

  const handleDeleteTask = (taskId: string | undefined) => {
    if (!listId || !taskId || exitingIds.has(taskId)) return;

    // Remove from the list so AnimatePresence can fade the row out,
    // then delete on the server after the animation finishes.
    setExitingIds((prev) => new Set(prev).add(taskId));

    window.setTimeout(async () => {
      try {
        await api.deleteTask(listId, taskId);
      } catch (error) {
        console.error("Error deleting task:", error);
      } finally {
        setExitingIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }
    }, 300);
  };

  const tasks =
    listId && state.tasks[listId]
      ? state.tasks[listId].filter((t) => t.id && !exitingIds.has(t.id))
      : [];

  if (isLoading) {
    return (
      <div className="app-panel max-w-3xl p-12 flex justify-center">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="app-panel max-w-3xl p-5 sm:p-8 animate-fade-in-up">
      <div className="flex items-center justify-between gap-3 mb-6">
        <Button
          variant="light"
          isIconOnly
          className="text-ink-500"
          aria-label="Go back to Task Lists"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 min-w-0 text-center">
          <p className="code-label mb-1">task-list</p>
          <h1 className="text-xl sm:text-2xl font-semibold text-ink-900 truncate">
            {taskList ? taskList.title : "Unknown Task List"}
          </h1>
        </div>

        <Button
          variant="light"
          isIconOnly
          className="text-ink-500"
          aria-label="Edit task list"
          onClick={() => navigate(`/edit-task-list/${listId}`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-ink-500 mb-2">
          <span>progress</span>
          <span>{Math.round(completionPercentage)}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <Button
        onClick={() => navigate(`/task-lists/${listId}/new-task`)}
        aria-label="Add new task"
        color="primary"
        className="mb-5 w-full font-mono font-medium shadow-soft"
        startContent={<Plus className="h-4 w-4" />}
      >
        Add Task
      </Button>

      <div className="rounded-xl border border-ink-200 bg-white/60 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[40px_1fr_90px_130px_88px] gap-2 px-4 py-2.5 border-b border-ink-200 bg-ink-50/80">
          <span className="code-label">ok</span>
          <span className="code-label">title</span>
          <span className="code-label">prio</span>
          <span className="code-label">due</span>
          <span className="code-label text-right">actions</span>
        </div>

        <AnimatePresence initial={false} mode="popLayout">
          {tasks.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-12 text-center text-sm text-ink-500"
            >
              // no tasks in this list
            </motion.div>
          )}

          {tasks.map((task) => {
            const done = TaskStatus.CLOSED === task.status;
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{
                  opacity: 0,
                  x: 40,
                  height: 0,
                  marginTop: 0,
                  marginBottom: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  borderWidth: 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`grid grid-cols-[40px_1fr_auto] sm:grid-cols-[40px_1fr_90px_130px_88px] gap-2 items-center px-4 py-3 border-b border-ink-100 last:border-b-0 ${
                  done ? "task-row-done bg-ink-50/40" : ""
                }`}
              >
                <Checkbox
                  isSelected={done}
                  onValueChange={() => toggleStatus(task)}
                  color="primary"
                  size="sm"
                  aria-label={`Mark task "${task.title}" as ${
                    done ? "open" : "closed"
                  }`}
                />

                <span
                  className={`task-title text-sm font-medium truncate ${
                    done ? "" : "text-ink-800"
                  }`}
                >
                  {task.title}
                </span>

                <div className="hidden sm:flex items-center gap-2 text-xs text-ink-500">
                  <span
                    className={`priority-dot ${
                      priorityStyles[task.priority] ?? priorityStyles[TaskPriority.MEDIUM]
                    }`}
                  />
                  {task.priority}
                </div>

                <div className="hidden sm:block">
                  {task.dueDate ? (
                    <DateInput
                      isDisabled
                      size="sm"
                      classNames={{
                        inputWrapper: "bg-transparent shadow-none border-0 h-7 min-h-7",
                        input: "text-xs text-ink-500",
                      }}
                      defaultValue={parseDate(
                        new Date(task.dueDate).toISOString().split("T")[0]
                      )}
                      aria-label={`Due date for task "${task.title}"`}
                    />
                  ) : (
                    <span className="text-xs text-ink-300">—</span>
                  )}
                </div>

                <div className="flex justify-end gap-1">
                  <Button
                    variant="light"
                    isIconOnly
                    size="sm"
                    className="text-ink-400 hover:text-accent-600"
                    aria-label={`Edit task "${task.title}"`}
                    onClick={() =>
                      navigate(`/task-lists/${listId}/edit-task/${task.id}`)
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="light"
                    isIconOnly
                    size="sm"
                    className="text-ink-400 hover:text-[#c46b6b]"
                    onClick={() => handleDeleteTask(task.id)}
                    aria-label={`Delete task "${task.title}"`}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          color="danger"
          variant="flat"
          startContent={<Minus size={18} />}
          onClick={deleteTaskList}
          aria-label="Delete current task list"
          className="font-mono"
        >
          Delete TaskList
        </Button>
      </div>
    </div>
  );
};

export default TaskListScreen;
