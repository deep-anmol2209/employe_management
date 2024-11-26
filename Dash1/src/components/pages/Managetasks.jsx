import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // Import the loading spinner
import Snackbar from '@mui/material/Snackbar'; // Import Snackbar for alerts
import Alert from '@mui/material/Alert'; // Import Alert to display success/error messages
import { useAuth } from "../context/AuthContext";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const Managetasks = () => {
  const [tasks, setAllTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message state
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar severity state
  const { apiCall } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await apiCall('/usertask/getallmanagetasks', { method: 'GET' });
        const tasksData = response?.data?.allTasks?.[0]?.managetask;
        console.log(tasksData)

        if (tasksData && tasksData.length > 0) {
          setAllTasks(tasksData);
        } else {
          setError("No tasks found");
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false); // Set loading to false when fetching ends
      }
    };

    fetchTasks();
  }, [apiCall]);

  // Handle "View" button click to open dialog with full description
  const handleViewClick = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  // Handle action (Complete or Reject)
  const handleActionClick = async (taskId, action) => {
    try {
      const endpoint = action === "reject" ? 'rejectTask' : 'completeTask';
    //   const taskId= tasksData.task._id
      console.log(taskId)
      const response = await apiCall(`/usertask/tasks/${taskId}`, {
        method: 'PATCH',
        data: { action },
      });
      console.log(response)

      if (response.data.success) {
        setSnackbarMessage(`Task ${action === "reject" ? "Rejected" : "Completed"} Successfully`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        // Remove task from the list after successful action
        setAllTasks((prevTasks) => prevTasks.filter(task => task.task._id !== taskId));
      } else {
        throw new Error('Task action failed');
      }
    } catch (error) {
      console.error(`Error ${action === "reject" ? "rejecting" : "completing"} task:`, error);
      setSnackbarMessage(`Failed to ${action === "reject" ? "Reject" : "Complete"} Task`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Function to close Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Function to display only the first 3 words of a string
  const displayFirstWords = (text) => {
    if (!text) return 'N/A';
    const words = text.split(' ');
    return words.length > 3 ? words.slice(0, 3).join(' ') + '...' : text;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Manage Tasks</h3>
        <div className="overflow-x-auto">
          {loading ? ( // Show loading spinner while loading
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : error ? (
            <p className="text-center text-gray-600">{error}</p>
          ) : (
            <table className="min-w-full bg-white border border-black">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">#</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Photo</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Department</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Task Title</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Task Description</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Submitted On</th>
                  <th className="px-4 py-2 border-b border-black text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task._id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white-50' : 'bg-gray-100'}`}>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{index + 1}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{task?.submittedBy?.name || 'N/A'}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">
                      {task?.submittedBy?.profilePicture?.secure_url ? (
                        <img src={task.submittedBy.profilePicture.secure_url} className="w-12 h-12 rounded-full" alt="User" />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{task?.submittedBy?.departmentId?.name || 'N/A'}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{task?.task?.title || 'N/A'}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">
                      {displayFirstWords(task?.task?.description)}
                    </td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">
                      {displayFirstWords(task?.description)}
                    </td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{formatDate(task?.task?.submittedOn) || 'N/A'}</td>
                    <td className="px-4 py-2 border-b border-black text-sm text-gray-700 flex mt-2 gap-2">
                      <Button
                        sx={{ height: "27px" }}
                        variant="outlined"
                        color="error"
                        onClick={() => handleActionClick(tasksData.task._id, "reject")}
                      >
                        Reject
                      </Button>
                      <Button
                        sx={{ height: "27px" }}
                        variant="outlined"
                        color="primary"
                        onClick={() => handleActionClick(task.task._id, "complete")}
                      >
                        Complete
                      </Button>
                      <Button
                        sx={{ height: "27px" }}
                        variant="outlined"
                        onClick={() => handleViewClick(task)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Dialog to show full task details */}
      {selectedTask && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Task Details</DialogTitle>
          <DialogContent>
            <p><strong>Task Description:</strong> {selectedTask?.task?.description || 'N/A'}</p>
            <p><strong>Description:</strong> {selectedTask?.description || 'N/A'}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar to show success/error messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Managetasks;
