import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Card } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAppContext } from "../AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TaskPriority } from "../domain/TaskPriority";
import { DatePicker } from "@nextui-org/date-picker";
import { TaskStatus } from "../domain/TaskStatus";
import { parseDate } from "@internationalized/date";

const CreateUpdateTaskScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId, taskId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus | undefined>(undefined);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!listId || !taskId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        if (!state.taskLists.find((tl) => tl.id === listId)) {
          await api.getTaskList(listId);
        }

        await api.getTask(listId, taskId);

        const task = state.tasks[listId]?.find((t) => t.id === taskId);

        if (task) {
          setTitle(task.title);
          setDescription(task.description || "");
          setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
          setPriority(task.priority || TaskPriority.MEDIUM);
          setStatus(task.status);
        }

        setIsUpdate(true);
      } catch (error) {
        console.error("Error loading task:", error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [listId, taskId]);

  useEffect(() => {
    if (listId && taskId && state.tasks[listId]) {
      const task = state.tasks[listId].find((t) => t.id === taskId);

      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
        setPriority(task.priority || TaskPriority.MEDIUM);
        setStatus(task.status);
      }
    }
  }, [listId, taskId, state.tasks]);

  const createUpdateTask = async () => {
    try {
      if (!listId) return;

      if (isUpdate && taskId) {
        await api.updateTask(listId, taskId, {
          id: taskId,
          title,
          description,
          dueDate,
          priority,
          status,
        });
      } else {
        await api.createTask(listId, {
          title,
          description,
          dueDate,
          priority,
          status: undefined,
        });
      }

      navigate(`/task-lists/${listId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    setDueDate(date || undefined);
  };

  const formatDateForPicker = (date: Date | undefined) => {
    if (!date) return undefined;
    return date.toISOString().split("T")[0];
  };

  if (isLoading) {
    return (
      <div className="app-panel max-w-md p-8 text-sm text-ink-500">
        loading…
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="app-panel max-w-md p-5 sm:p-7"
    >
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="light"
          isIconOnly
          className="text-ink-500"
          aria-label="Go back"
          onClick={() => navigate(`/task-lists/${listId}`)}
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <p className="code-label mb-0.5">
            {isUpdate ? "edit" : "new"} · task
          </p>
          <h1 className="text-xl font-semibold text-ink-900">
            {isUpdate ? "Update Task" : "Create Task"}
          </h1>
        </div>
      </div>

      {error && (
        <Card className="mb-4 p-3 bg-[#f5e4e4] border border-[#e8b4b4] shadow-none text-sm text-[#8a4a4a]">
          {error}
        </Card>
      )}

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-4"
      >
        <Input
          label="Title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          classNames={{
            label: "font-mono text-ink-500",
            input: "font-mono",
            inputWrapper: "bg-white/80 border border-ink-200 shadow-none",
          }}
        />
        <Textarea
          label="Description"
          placeholder="Enter task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          classNames={{
            label: "font-mono text-ink-500",
            input: "font-mono",
            inputWrapper: "bg-white/80 border border-ink-200 shadow-none",
          }}
        />
        <DatePicker
          label="Due date (optional)"
          classNames={{
            label: "font-mono text-ink-500",
            inputWrapper: "bg-white/80 border border-ink-200 shadow-none",
          }}
          defaultValue={
            dueDate ? parseDate(formatDateForPicker(dueDate)!) : undefined
          }
          onChange={(newDate) =>
            handleDateChange(newDate ? new Date(newDate.toString()) : null)
          }
        />

        <div>
          <p className="code-label mb-2">priority</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(TaskPriority).map((p) => {
              const selected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 border ${
                    selected
                      ? "bg-accent-100 border-accent-300 text-accent-700 shadow-soft"
                      : "bg-white/70 border-ink-200 text-ink-500 hover:border-ink-300"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          color="primary"
          onClick={createUpdateTask}
          fullWidth
          className="mt-2 font-mono font-medium shadow-soft"
        >
          {isUpdate ? "Update Task" : "Create Task"}
        </Button>
      </form>
    </motion.div>
  );
};

export default CreateUpdateTaskScreen;
