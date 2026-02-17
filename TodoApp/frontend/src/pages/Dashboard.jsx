// import { useEffect, useState } from "react";
// import API from "../api/axios";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { FiCheckCircle, FiEdit, FiTrash2, FiRefreshCw } from "react-icons/fi";

// export default function Dashboard({ setIsAuthenticated }) {
//     const [tasks, setTasks] = useState([]);
//     const [form, setForm] = useState({ title: "", description: "", due_date: "" });
//     const [editingId, setEditingId] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);

//     const fetchTasks = async () => {
//         try {
//             const res = await API.get("/tasks");
//             setTasks(res.data);
//         } catch (error) {
//             console.error("Fetch tasks error:", error.response?.data || error.message);
//             alert("Failed to fetch tasks");
//         }
//     };

//     useEffect(() => {
//         fetchTasks();
//     }, []);

//     const incompleteTasks = tasks.filter((t) => t.status !== "completed");
//     const completedTasks = tasks.filter((t) => t.status === "completed");
//     const upcomingTasks = tasks.filter(
//         (t) => t.due_date && new Date(t.due_date) > new Date() && t.status !== "completed"
//     );

//     const onDragEnd = async (result) => {
//         if (!result.destination) return;

//         const items = Array.from(incompleteTasks);
//         const [reordered] = items.splice(result.source.index, 1);
//         items.splice(result.destination.index, 0, reordered);

//         const mergedTasks = [...items, ...completedTasks];
//         setTasks(mergedTasks);

//         try {
//             await API.post(
//                 "/tasks/reorder",
//                 items.map((task) => task.id)
//             );
//         } catch {
//             alert("Failed to reorder tasks");
//             fetchTasks();
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!form.title.trim()) return alert("Title required");

//         const payload = {
//             ...form,
//             due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
//         };

//         Object.keys(payload).forEach(
//             (key) => (payload[key] === "" || payload[key] == null) && delete payload[key]
//         );

//         try {
//             if (editingId) {
//                 await API.put(`/tasks/${editingId}`, { updated: payload });
//                 setEditingId(null);
//             } else {
//                 await API.post("/tasks/", payload);
//             }
//             setForm({ title: "", description: "", due_date: "" });
//             setModalOpen(false);
//             fetchTasks();
//         } catch (error) {
//             console.error("❌ Save task error:", error);
//             alert("Failed to save task");
//         }
//     };

//     const deleteTask = async (id) => {
//         if (!confirm("Delete this task?")) return;
//         try {
//             await API.delete(`/tasks/${id}`);
//             fetchTasks();
//         } catch {
//             alert("Failed to delete");
//         }
//     };

//     const editTask = (task) => {
//         setEditingId(task.id);
//         setForm({
//             title: task.title,
//             description: task.description || "",
//             due_date: task.due_date ? task.due_date.slice(0, 10) : "",
//         });
//         setModalOpen(true);
//     };

//     const toggleStatus = async (task) => {
//         try {
//             const updatedTask = {
//                 title: task.title,
//                 description: task.description || "",
//                 due_date: task.due_date,
//                 order: task.order,
//                 status: task.status === "completed" ? "incomplete" : "completed",
//             };
//             await API.put(`/tasks/${task.id}`, { updated: updatedTask });
//             fetchTasks();
//         } catch (error) {
//             console.error("❌ Failed to update status:", error);
//             alert("Failed to update status");
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem("token");
//         setIsAuthenticated(false);
//     };

//     return (
//         <>
//             <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-50">
//                 {/* Sidebar */}
//                 <div className="w-full lg:w-64 bg-gray-900 text-white flex flex-row lg:flex-col justify-between p-4 
//     order-last lg:order-none border-t lg:border-t-0">

//                     {/* Top Buttons */}
//                     <div className="flex flex-1 flex-row lg:flex-col gap-4 w-full justify-center lg:justify-start">
//                         <button
//                             onClick={() => {
//                                 setModalOpen(true);
//                                 setEditingId(null);
//                                 setForm({ title: "", description: "", due_date: "" });
//                             }}
//                             className="flex-1 bg-green-600 hover:bg-green-700 transition py-2 lg:py-3 rounded text-sm lg:text-lg font-semibold text-center"
//                         >
//                             + Create Task
//                         </button>

//                         {/* Logout in mobile/tablet (inline) */}
//                         <button
//                             onClick={logout}
//                             className="flex-1 bg-red-600 hover:bg-red-700 transition py-2 lg:hidden rounded text-sm font-semibold text-center"
//                         >
//                             Logout
//                         </button>
//                     </div>

//                     {/* Logout in desktop (bottom) */}
//                     <div className="hidden lg:block mt-4">
//                         <button
//                             onClick={logout}
//                             className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded text-lg font-semibold"
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 </div>


//                 {/* Middle Section */}
//                 <main className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto gap-6">
//                     {/* Incomplete Tasks */}
//                     <section className="flex flex-col order-1" style={{ height: "auto", flexGrow: 1 }}>
//                         <h2 className="text-2xl font-bold mb-4">Incomplete Tasks</h2>
//                         <DragDropContext onDragEnd={onDragEnd}>
//                             <Droppable droppableId="incomplete-tasks">
//                                 {(provided) => (
//                                     <ul
//                                         {...provided.droppableProps}
//                                         ref={provided.innerRef}
//                                         className="overflow-auto border rounded bg-white shadow p-2"
//                                         style={{ maxHeight: "100%" }}
//                                     >
//                                         {incompleteTasks.map((task, index) => (
//                                             <Draggable
//                                                 draggableId={task.id.toString()}
//                                                 index={index}
//                                                 key={task.id}
//                                             >
//                                                 {(provided, snapshot) => (
//                                                     <li
//                                                         ref={provided.innerRef}
//                                                         {...provided.draggableProps}
//                                                         {...provided.dragHandleProps}
//                                                         className={`flex justify-between items-center p-3 mb-2 rounded cursor-move ${snapshot.isDragging
//                                                             ? "bg-blue-100 shadow"
//                                                             : "bg-gray-50 hover:bg-gray-100"
//                                                             }`}
//                                                     >
//                                                         <div className="flex flex-col flex-grow">
//                                                             <span className="font-medium">{task.title}</span>
//                                                             {task.description && (
//                                                                 <span className="text-sm text-gray-600">{task.description}</span>
//                                                             )}
//                                                             {task.due_date && (
//                                                                 <span className="text-xs text-gray-400 mt-1">
//                                                                     Due: {task.due_date.slice(0, 10)}
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                         <div className="flex space-x-3 ml-4">
//                                                             <button onClick={() => toggleStatus(task)} className="text-green-600 hover:text-green-900" title="Mark as done">
//                                                                 <FiCheckCircle size={22} />
//                                                             </button>
//                                                             <button onClick={() => editTask(task)} className="text-blue-600 hover:text-blue-900" title="Edit task">
//                                                                 <FiEdit size={22} />
//                                                             </button>
//                                                             <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-900" title="Delete task">
//                                                                 <FiTrash2 size={22} />
//                                                             </button>
//                                                         </div>
//                                                     </li>
//                                                 )}
//                                             </Draggable>
//                                         ))}
//                                         {provided.placeholder}
//                                     </ul>
//                                 )}
//                             </Droppable>
//                         </DragDropContext>
//                     </section>

//                     {/* Upcoming Tasks */}
//                     <section className="flex flex-col order-2 border rounded bg-white shadow p-3 lg:hidden">
//                         <h2 className="text-2xl font-bold mb-2">Upcoming Tasks</h2>
//                         {upcomingTasks.length === 0 ? (
//                             <p className="text-gray-500">No upcoming tasks.</p>
//                         ) : (
//                             <ul className="space-y-4">
//                                 {upcomingTasks.map((task) => (
//                                     <li
//                                         key={task.id}
//                                         className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-default"
//                                         title={`Due on ${task.due_date.slice(0, 10)}`}
//                                     >
//                                         <div className="flex flex-col">
//                                             <span className="font-semibold text-blue-900">{task.title}</span>
//                                             {task.description && (
//                                                 <span className="text-sm text-blue-700 mt-1">{task.description}</span>
//                                             )}
//                                             {task.due_date && (
//                                                 <span className="text-xs text-blue-500 mt-2 font-mono">
//                                                     Due: {task.due_date.slice(0, 10)}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </section>

//                     {/* Completed Tasks */}
//                     <section className="flex flex-col order-3 border rounded bg-white shadow p-3">
//                         <h2 className="text-2xl font-bold mb-2">Completed Tasks</h2>
//                         <ul className="overflow-auto">
//                             {completedTasks.length === 0 && (
//                                 <p className="text-gray-500">No completed tasks yet.</p>
//                             )}
//                             {completedTasks.map((task) => (
//                                 <li key={task.id} className="flex justify-between items-center p-2 border-b last:border-b-0 bg-gray-100 rounded mb-1">
//                                     <div className="flex flex-col flex-grow">
//                                         <span className="font-medium line-through text-gray-500">{task.title}</span>
//                                         {task.description && (
//                                             <span className="text-sm text-gray-600">{task.description}</span>
//                                         )}
//                                         {task.due_date && (
//                                             <span className="text-xs text-gray-400 mt-1">
//                                                 Due: {task.due_date.slice(0, 10)}
//                                             </span>
//                                         )}
//                                     </div>
//                                     <div className="flex space-x-3 ml-4">
//                                         <button onClick={() => toggleStatus(task)} className="text-yellow-600 hover:text-yellow-900" title="Mark as incomplete">
//                                             <FiRefreshCw size={22} />
//                                         </button>
//                                         <button onClick={() => editTask(task)} className="text-blue-600 hover:text-blue-900" title="Edit task">
//                                             <FiEdit size={22} />
//                                         </button>
//                                         <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-900" title="Delete task">
//                                             <FiTrash2 size={22} />
//                                         </button>
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     </section>
//                 </main>

//                 {/* Upcoming Sidebar - only visible on large screens */}
//                 <aside className="hidden lg:block w-80 border-l p-6 overflow-y-auto bg-white">
//                     <h2 className="text-2xl font-bold mb-4 text-center">Upcoming Tasks</h2>
//                     {upcomingTasks.length === 0 ? (
//                         <p className="text-gray-500 text-center">No upcoming tasks.</p>
//                     ) : (
//                         <ul className="space-y-4">
//                             {upcomingTasks.map((task) => (
//                                 <li key={task.id} className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-default">
//                                     <div className="flex flex-col">
//                                         <span className="font-semibold text-blue-900">{task.title}</span>
//                                         {task.description && (
//                                             <span className="text-sm text-blue-700 mt-1">{task.description}</span>
//                                         )}
//                                         {task.due_date && (
//                                             <span className="text-xs text-blue-500 mt-2 font-mono">
//                                                 Due: {task.due_date.slice(0, 10)}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </aside>
//             </div>

//             {/* Modal */}
//             {modalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
//                     <form
//                         onSubmit={handleSubmit}
//                         className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
//                     >
//                         <h2 className="text-xl font-bold mb-4">
//                             {editingId ? "Edit Task" : "Create Task"}
//                         </h2>
//                         <input
//                             type="text"
//                             placeholder="Title"
//                             value={form.title}
//                             onChange={(e) => setForm({ ...form, title: e.target.value })}
//                             className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             required
//                             autoFocus
//                         />
//                         <textarea
//                             placeholder="Description"
//                             value={form.description}
//                             onChange={(e) => setForm({ ...form, description: e.target.value })}
//                             className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
//                             rows={3}
//                         />
//                         <input
//                             type="date"
//                             value={form.due_date}
//                             onChange={(e) => setForm({ ...form, due_date: e.target.value })}
//                             className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         />
//                         <div className="flex justify-end space-x-3">
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     setModalOpen(false);
//                                     setEditingId(null);
//                                     setForm({ title: "", description: "", due_date: "" });
//                                 }}
//                                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                             >
//                                 {editingId ? "Update" : "Create"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             )}
//         </>
//     );
// }



import { useEffect, useState } from "react";
import API from "../api/axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiCheckCircle, FiEdit, FiTrash2, FiRefreshCw } from "react-icons/fi";

export default function Dashboard({ setIsAuthenticated }) {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", due_date: "" });
    const [editingId, setEditingId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const fetchTasks = async () => {
        try {
            const res = await API.get("/tasks");
            setTasks(res.data);
        } catch (error) {
            console.error("Fetch tasks error:", error.response?.data || error.message);
            alert("Failed to fetch tasks");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const incompleteTasks = tasks.filter((t) => t.status !== "completed");
    const completedTasks = tasks.filter((t) => t.status === "completed");
    const upcomingTasks = tasks.filter(
        (t) => t.due_date && new Date(t.due_date) > new Date() && t.status !== "completed"
    );

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const items = Array.from(incompleteTasks);
        const [reordered] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reordered);
        const mergedTasks = [...items, ...completedTasks];
        setTasks(mergedTasks);
        try {
            await API.post(
                "/tasks/reorder",
                items.map((task) => task.id)
            );
        } catch {
            alert("Failed to reorder tasks");
            fetchTasks();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return alert("Title required");
        const payload = {
            ...form,
            due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
        };
        Object.keys(payload).forEach(
            (key) => (payload[key] === "" || payload[key] == null) && delete payload[key]
        );
        try {
            if (editingId) {
                await API.put(`/tasks/${editingId}`, { updated: payload });
                setEditingId(null);
            } else {
                await API.post("/tasks/", payload);
            }
            setForm({ title: "", description: "", due_date: "" });
            setModalOpen(false);
            fetchTasks();
        } catch (error) {
            console.error("❌ Save task error:", error);
            alert("Failed to save task");
        }
    };

    const deleteTask = async (id) => {
        if (!confirm("Delete this task?")) return;
        try {
            await API.delete(`/tasks/${id}`);
            fetchTasks();
        } catch {
            alert("Failed to delete");
        }
    };

    const editTask = (task) => {
        setEditingId(task.id);
        setForm({
            title: task.title,
            description: task.description || "",
            due_date: task.due_date ? task.due_date.slice(0, 10) : "",
        });
        setModalOpen(true);
    };

    const toggleStatus = async (task) => {
        try {
            const updatedTask = {
                title: task.title,
                description: task.description || "",
                due_date: task.due_date,
                order: task.order,
                status: task.status === "completed" ? "incomplete" : "completed",
            };
            await API.put(`/tasks/${task.id}`, { updated: updatedTask });
            fetchTasks();
        } catch (error) {
            console.error("❌ Failed to update status:", error);
            alert("Failed to update status");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    const viewTaskDetails = (task) => {
        setSelectedTask(task);
    };

    return (
        <>

            <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-50">
                {/* Sidebar */}
                <div className="w-full lg:w-64 bg-gray-900 text-white flex flex-row lg:flex-col justify-between p-4 
    order-last lg:order-none border-t lg:border-t-0">

                    {/* Top Buttons */}
                    <div className="flex flex-1 flex-row lg:flex-col gap-4 w-full justify-center lg:justify-start">
                        <button
                            onClick={() => {
                                setModalOpen(true);
                                setEditingId(null);
                                setForm({ title: "", description: "", due_date: "" });
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700 transition py-2 lg:py-3 rounded text-sm lg:text-lg font-semibold text-center"
                        >
                            + Create Task
                        </button>

                        {/* Logout in mobile/tablet (inline) */}
                        <button
                            onClick={logout}
                            className="flex-1 bg-red-600 hover:bg-red-700 transition py-2 lg:hidden rounded text-sm font-semibold text-center"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Logout in desktop (bottom) */}
                    <div className="hidden lg:block mt-4">
                        <button
                            onClick={logout}
                            className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded text-lg font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                </div>


                {/* Middle Section */}
                <main className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto gap-6">
                    {/* Incomplete Tasks */}
                    <section className="flex flex-col order-1" style={{ height: "auto", flexGrow: 1 }}>
                        <h2 className="text-2xl font-bold mb-4">Incomplete Tasks</h2>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="incomplete-tasks">
                                {(provided) => (
                                    <ul
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="overflow-auto border rounded bg-white shadow p-2"
                                        style={{ maxHeight: "100%" }}
                                    >
                                        {incompleteTasks.map((task, index) => (
                                            <Draggable
                                                draggableId={task.id.toString()}
                                                index={index}
                                                key={task.id}
                                            >
                                                {(provided, snapshot) => (
                                                    <li
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`flex justify-between items-center p-3 mb-2 rounded cursor-move ${snapshot.isDragging
                                                            ? "bg-blue-100 shadow"
                                                            : "bg-gray-50 hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <div
                                                            className="flex flex-col flex-grow cursor-pointer"
                                                            onClick={() => viewTaskDetails(task)}
                                                        >

                                                            <span className="font-medium">{task.title}</span>
                                                            {task.description && (
                                                                <span className="text-sm text-gray-600">{task.description}</span>
                                                            )}
                                                            {task.due_date && (
                                                                <span className="text-xs text-gray-400 mt-1">
                                                                    Due: {task.due_date.slice(0, 10)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex space-x-3 ml-4">
                                                            <button onClick={() => toggleStatus(task)} className="text-green-600 hover:text-green-900" title="Mark as done">
                                                                <FiCheckCircle size={22} />
                                                            </button>
                                                            <button onClick={() => editTask(task)} className="text-blue-600 hover:text-blue-900" title="Edit task">
                                                                <FiEdit size={22} />
                                                            </button>
                                                            <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-900" title="Delete task">
                                                                <FiTrash2 size={22} />
                                                            </button>
                                                        </div>
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </section>


                    {/* Upcoming Tasks */}
                    <section className="flex flex-col order-2 border rounded bg-white shadow p-3 lg:hidden">
                        <h2 className="text-2xl font-bold mb-2">Upcoming Tasks</h2>
                        {upcomingTasks.length === 0 ? (
                            <p className="text-gray-500">No upcoming tasks.</p>
                        ) : (
                            <ul className="space-y-4">
                                {upcomingTasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-default"
                                        title={`Due on ${task.due_date.slice(0, 10)}`}
                                    >
                                        <div
                                            className="flex flex-col cursor-pointer"
                                            onClick={() => viewTaskDetails(task)}
                                        >
                                            <span className="font-semibold text-blue-900">{task.title}</span>
                                            {task.description && (
                                                <span className="text-sm text-blue-700 mt-1">{task.description}</span>
                                            )}
                                            {task.due_date && (
                                                <span className="text-xs text-blue-500 mt-2 font-mono">
                                                    Due: {task.due_date.slice(0, 10)}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>


                    {/* Completed Tasks */}
                    <section className="flex flex-col order-3 border rounded bg-white shadow p-3">
                        <h2 className="text-2xl font-bold mb-2">Completed Tasks</h2>
                        <ul className="overflow-auto">
                            {completedTasks.length === 0 && (
                                <p className="text-gray-500">No completed tasks yet.</p>
                            )}
                            {completedTasks.map((task) => (
                                <li key={task.id} className="flex justify-between items-center p-2 border-b last:border-b-0 bg-gray-100 rounded mb-1">
                                    <div
                                        className="flex flex-col flex-grow cursor-pointer"
                                        onClick={() => viewTaskDetails(task)}
                                    >

                                        <span className="font-medium line-through text-gray-500">{task.title}</span>
                                        {task.description && (
                                            <span className="text-sm text-gray-600">{task.description}</span>
                                        )}
                                        {task.due_date && (
                                            <span className="text-xs text-gray-400 mt-1">
                                                Due: {task.due_date.slice(0, 10)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex space-x-3 ml-4">
                                        <button onClick={() => toggleStatus(task)} className="text-yellow-600 hover:text-yellow-900" title="Mark as incomplete">
                                            <FiRefreshCw size={22} />
                                        </button>
                                        <button onClick={() => editTask(task)} className="text-blue-600 hover:text-blue-900" title="Edit task">
                                            <FiEdit size={22} />
                                        </button>
                                        <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-900" title="Delete task">
                                            <FiTrash2 size={22} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </main>

                {/* Upcoming Sidebar - only visible on large screens */}
                <aside className="hidden lg:block w-80 border-l p-6 overflow-y-auto bg-white">
                    <h2 className="text-2xl font-bold mb-4 text-center">Upcoming Tasks</h2>
                    {upcomingTasks.length === 0 ? (
                        <p className="text-gray-500 text-center">No upcoming tasks.</p>
                    ) : (
                        <ul className="space-y-4">
                            {upcomingTasks.map((task) => (
                                <li key={task.id} className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-default">
                                    <div
                                        className="flex flex-col cursor-pointer"
                                        onClick={() => viewTaskDetails(task)}
                                    >
                                        <span className="font-semibold text-blue-900">{task.title}</span>
                                        {task.description && (
                                            <span className="text-sm text-blue-700 mt-1">{task.description}</span>
                                        )}
                                        {task.due_date && (
                                            <span className="text-xs text-blue-500 mt-2 font-mono">
                                                Due: {task.due_date.slice(0, 10)}
                                            </span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </aside>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                    >
                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? "Edit Task" : "Create Task"}
                        </h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            autoFocus
                        />
                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                            rows={3}
                        />
                        <input
                            type="date"
                            value={form.due_date}
                            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setModalOpen(false);
                                    setEditingId(null);
                                    setForm({ title: "", description: "", due_date: "" });
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                {editingId ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Task Details Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative transform transition-transform duration-300 ease-in-out scale-95 hover:scale-100">
                        <button
                            onClick={() => setSelectedTask(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                            title="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-3">{selectedTask.title}</h2>
                        <p className="text-gray-700 mb-2">{selectedTask.description || "No description provided."}</p>
                        <p className="text-sm text-gray-500 mb-1">
                            Due: {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : "No due date"}
                        </p>
                        <p className={`text-sm font-semibold mb-4 ${selectedTask.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                            Status: {selectedTask.status}
                        </p>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    editTask(selectedTask);
                                    setSelectedTask(null);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    deleteTask(selectedTask.id);
                                    setSelectedTask(null);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

