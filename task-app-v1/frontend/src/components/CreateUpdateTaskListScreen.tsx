import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Card } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAppContext } from "../AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CreateUpdateTaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();

  const { listId } = useParams();

  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("" as string | undefined);

  const navigate = useNavigate();

  const findTaskList = (taskListId: string) => {
    const filteredTaskLists = state.taskLists.filter(
      (tl) => taskListId == tl.id
    );
    if (filteredTaskLists.length === 1) {
      return filteredTaskLists[0];
    }
    return null;
  };

  const populateTaskList = (taskListId: string) => {
    const taskList = findTaskList(taskListId);
    if (null != taskList) {
      setTitle(taskList.title);
      setDescription(taskList.description);
      setIsUpdate(true);
    }
  };

  useEffect(() => {
    if (null != listId) {
      if (null == state.taskLists) {
        api.fetchTaskLists().then(() => populateTaskList(listId));
      } else {
        populateTaskList(listId);
      }
    }
  }, [listId]);

  const createUpdateTaskList = async () => {
    try {
      if (isUpdate && null != listId) {
        await api.updateTaskList(listId, {
          id: listId,
          title: title,
          description: description,
          count: undefined,
          progress: undefined,
          tasks: undefined,
        });
      } else {
        await api.createTaskList({
          title: title,
          description: description,
          count: undefined,
          progress: undefined,
          tasks: undefined,
        });
      }

      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
          onClick={() => navigate("/")}
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <p className="code-label mb-0.5">
            {isUpdate ? "edit" : "new"} · list
          </p>
          <h1 className="text-xl font-semibold text-ink-900">
            {isUpdate ? "Update Task List" : "Create Task List"}
          </h1>
        </div>
      </div>

      {error.length > 0 && (
        <Card className="mb-4 p-3 bg-[#f5e4e4] border border-[#e8b4b4] shadow-none text-sm text-[#8a4a4a]">
          {error}
        </Card>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="Enter task list title"
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
          placeholder="Enter task list description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          classNames={{
            label: "font-mono text-ink-500",
            input: "font-mono",
            inputWrapper: "bg-white/80 border border-ink-200 shadow-none",
          }}
        />
        <Button
          type="submit"
          color="primary"
          onClick={createUpdateTaskList}
          fullWidth
          className="mt-2 font-mono font-medium shadow-soft"
        >
          {isUpdate ? "Update Task List" : "Create Task List"}
        </Button>
      </form>
    </motion.div>
  );
};

export default CreateUpdateTaskListScreen;
