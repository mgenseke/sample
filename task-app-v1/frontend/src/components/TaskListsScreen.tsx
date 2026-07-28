import { Button } from "@nextui-org/react";
import { List, Plus, ChevronRight } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../AppProvider";

const TaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();

  // Always refresh lists when opening the overview so count/progress stay current
  useEffect(() => {
    api.fetchTaskLists();
  }, []);

  const navigate = useNavigate();

  const handleCreateTaskList = () => {
    navigate("/new-task-list");
  };

  const handleSelectTaskList = (taskListId: string | undefined) => {
    navigate(`/task-lists/${taskListId}`);
  };

  return (
    <div className="app-panel max-w-lg p-6 sm:p-8 animate-fade-in-up">
      <div className="mb-6">
        <p className="code-label mb-2">~/task-app</p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
          My Task Lists
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {state.taskLists.length} list{state.taskLists.length === 1 ? "" : "s"}
        </p>
      </div>

      <Button
        onPress={handleCreateTaskList}
        color="primary"
        startContent={<Plus size={18} aria-hidden="true" />}
        className="w-full mb-6 font-mono font-medium shadow-soft"
        aria-label="Create New Task List"
      >
        Create New Task List
      </Button>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {state.taskLists.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-dashed border-ink-200 bg-ink-50/60 px-4 py-10 text-center"
            >
              <p className="text-sm text-ink-500">
                // no lists yet — create one above
              </p>
            </motion.div>
          )}

          {state.taskLists.map((list, index) => {
            const progress = list.progress ? list.progress * 100 : 0;
            return (
              <motion.button
                key={list.id}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.28, delay: index * 0.04 }}
                onClick={() => handleSelectTaskList(list.id)}
                className="group w-full text-left rounded-xl border border-ink-200 bg-white/70 px-4 py-3.5 shadow-soft transition-all duration-200 hover:border-accent-300 hover:shadow-lift hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
                aria-label={`Select task list: ${list.title}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                      <List size={16} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-base font-medium text-ink-900 truncate">
                        {list.title}
                      </h2>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {list.count ?? 0} tasks · {Math.round(progress)}% done
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="mt-1 shrink-0 text-ink-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="progress-track mt-3">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskListScreen;
