import React, { useState, useEffect } from "react";

function Kanban() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("kanbanColumns");
    return saved
      ? JSON.parse(saved)
      : {
          todo: {
            name: "To do",
            items: [],
          },
          inProgress: {
            name: "In Progress",
            items: [],
          },

          done: {
            name: "Done",
            items: [],
          },
        };
  });

  useEffect(() => {
    localStorage.setItem("kanbanColumns", JSON.stringify(columns));
  }, [columns]);

  const [newTask, setNewTask] = useState("");
  const [activeColumn, setActiveColumn] = useState("todo");
  const [draggedItem, setDraggedItem] = useState(null);

  const addNewTask = () => {
    if (newTask.trim() === "") return;
    const updateColumns = { ...columns };

    updateColumns[activeColumn].items.push({
      id: Date.now().toString(),
      content: newTask,
    });

    setColumns(updateColumns);
    setNewTask("");
  };

  const removeTask = (columnId, taskid) => {
    const updatedColumns = { ...columns };
    updatedColumns[columnId].items = updatedColumns[columnId].items.filter(
      (item) => item.id !== taskid,
    );
    setColumns(updatedColumns);
  };

  const handleDragStart = (columnId, item) => {
    setDraggedItem({ columnId, item });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();

    if (!draggedItem) return;

    const { columnId: sourceColumnId, item } = draggedItem;
    if (sourceColumnId === columnId) return;

    const updatedColumns = { ...columns };

    updatedColumns[sourceColumnId].items = updatedColumns[
      sourceColumnId
    ].items.filter((i) => i.id != item.id);
    updatedColumns[columnId].items.push(item);
    setColumns(updatedColumns);
    setDraggedItem(null);
  };

  const columnStyles = {
    todo: {
      header: "bg-gradient-to-r from-blue-600 to-blue-400",
      border: "border-blue-400",
    },

    inProgress: {
      header: "bg-gradient-to-r from-yellow-600 to-yellow-400",
      border: "border-yellow-400",
    },

    done: {
      header: "bg-gradient-to-r from-green-600 to to-green-400",
      border: "border-green-400",
    },
  };

  const updateTaskDetails = (columnId, taskId, updates) => {
    setColumns((prev) => {
      const newItems = prev[columnId].items.map((item) =>
        item.id === taskId ? { ...item, ...updates } : item,
      );
      return { ...prev, [columnId]: { ...prev[columnId], items: newItems } };
    });
  };

  return (
    <>
      <div className="p-6 w-full min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center">
        <div className="flex items-center justify-center flex-col gap-4 w-full max-w-full-6xl">
          <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400 ">
            Kanban Board
          </h1>

          <div className="mb-8 flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new Task"
              className="flex-grow p-3 bg-zinc-700 text-white"
              onKeyDown={(e) => {
                e.key === "Enter" && addNewTask();
              }}
            />

            <select
              value={activeColumn}
              onChange={(e) => setActiveColumn(e.target.value)}
              className="p-3 bg-zinc-700 text-white border-0 border-1 border-zinc-600"
            >
              {Object.keys(columns).map((columnId) => (
                <option value={columnId} key={columnId}>
                  {columns[columnId].name}
                </option>
              ))}
            </select>

            <button
              onClick={addNewTask}
              className="px-6 bg-gradient-to-r from-yellow-600 to-amber-500 text-white font-medium hover:from-yellow-500 hover:to-amber-400 transition-all duration-200 cursor-pointer"
            >
              Add
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 w-full">
            {Object.keys(columns).map((columnId) => (
              <div
                key={columnId}
                className={`flex-shrink-0 w-80 bg-zinc-800 rounded-lg shadow-xl border-t-4 ${columnStyles[columnId.border]}`}
                onDragOver={(e) => handleDragOver(e, columnId)}
                onDrop={(e) => handleDrop(e, columnId)}
              >
                <div
                  className={`p-4 text-white font-bold text-xl rounded-t-md ${columnStyles[columnId].header}`}
                >
                  {columns[columnId].name}
                  <span className="ml-2 px-2 py-1 bg-zinc-800 bg-opacity-30 rounded-full text-sm ">
                    {columns[columnId].items.length}
                  </span>
                </div>

                <div className="p-3 min-h-64">
                  {columns[columnId].items.length === 0 ? (
                    <div
                      className="text-center py-10 text-zinc-500
                                    italic text-sm"
                    >
                      Drop tasks here
                    </div>
                  ) : (
                    columns[columnId].items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 mb-3 bg-zinc-700 text-white rounded-lg shadow-md cursor-move flex items-center justify-between transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                        draggable
                        onDragStart={() => handleDragStart(columnId, item)}
                        onClick={() => setSelectedTask({ columnId, ...item })}
                      >
                        <span className="mr-2">{item.content}</span>
                        <button
                          onClick={() => removeTask(columnId, item.id)}
                          className="bg-zinc-400 hover:text-red-400 transition-colors duration-200 w-6 h-6 flex justify-center items-center
                                                rounded-full hover:bg-zinc-600"
                        >
                          <span className="text-lg cursor-pointer"></span>
                        </button>
                  
                      </div>
                    ))
                  )}
                
                </div>
              </div>
            ))}
          </div>
        </div>
        {selectedTask && (
                          <div className="fixed inset-0 z-50 flex justify-end">
                            {/* Background Dimmer */}
                            <div
                              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                              onClick={() => setSelectedTask(null)}
                            />

                            {/* Sidebar Panel */}
                            <div className="relative w-full max-w-lg bg-zinc-900 h-full shadow-2xl border-l border-zinc-700 p-8 flex flex-col gap-6 overflow-y-auto">
                              <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">
                                  Edit Idea
                                </h2>
                                <button
                                  onClick={() => setSelectedTask(null)}
                                  className="text-zinc-400 hover:text-white text-2xl"
                                >
                                  ×
                                </button>
                              </div>

                              <div>
                                <label className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                                  Main Concept
                                </label>
                                <input
                                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white mt-2"
                                  value={selectedTask.content}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedTask({
                                      ...selectedTask,
                                      content: val,
                                    });
                                    updateTaskDetails(
                                      selectedTask.columnId,
                                      selectedTask.id,
                                      { content: val },
                                    );
                                  }}
                                />
                              </div>

                              <div>
                                <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                                  The Hook (Hook Laboratory)
                                </label>
                                <textarea
                                  placeholder="Start with a transformation..."
                                  className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-lg text-white mt-2 h-32 resize-none"
                                  value={selectedTask.hook || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedTask({
                                      ...selectedTask,
                                      hook: val,
                                    });
                                    updateTaskDetails(
                                      selectedTask.columnId,
                                      selectedTask.id,
                                      { hook: val },
                                    );
                                  }}

                                
                                />
                              </div>

                              <div>
                                <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                                  The Main Concept
                                </label>
                                <textarea
                                  placeholder="Start with the main idea..."
                                  className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-lg text-white mt-2 h-32 resize-none"
                                  value={selectedTask.hook || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedTask({
                                      ...selectedTask,
                                      hook: val,
                                    });
                                    updateTaskDetails(
                                      selectedTask.columnId,
                                      selectedTask.id,
                                      { hook: val },
                                    );
                                  }}

                                
                                />
                              </div>

                              <div className="mt-auto">
                                <button
                                  onClick={() => setSelectedTask(null)}
                                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:brightness-110 transition-all cursor-pointer"
                                >
                                  Save & Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
      </div>
    </>
  );
}

export default Kanban;
