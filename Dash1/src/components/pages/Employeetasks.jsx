import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress'; // Import LinearProgress
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Employeetasks = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewDescription, setViewDescription] = useState('');
  const [submitting, setSubmitting] = useState(false); // State for tracking submission loading
  const { apiCall, user } = useAuth();

  useEffect(() => {
    const empid = user.id;
    const fetchTasks = async () => {
      try {
        const response = await apiCall(`/usertask/getemployeependingtask/${empid}`, {
          method: "GET",
        });
        setLoading(false);
        setTasks(response.data.pendingTasks);
      } catch (error) {
        setError(response.data.msg);
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [apiCall, user.id]);

  const handleClickOpen = (taskId) => {
    setSelectedTaskId(taskId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTaskId(null);
    setSubmitting(false); // Reset submitting state when closing the dialog
  };

  const handleDialogSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true); // Set submitting state to true
    const formData = new FormData(event.currentTarget);
    const description = { description: formData.get('description') };

    try {
      await apiCall(`/usertask/tasks/${selectedTaskId}/complete`, {
        method: 'PATCH',
        data: description,
      });

      // Optionally refetch tasks or update the task state here
      handleClose(); // Close dialog after successful submission
    } catch (error) {
      console.error('Error submitting task:', error);
      setSubmitting(false); // Reset submitting state if there's an error
    }
  };

  const handleViewClick = (description) => {
    setViewDescription(description);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
  };

  const truncateDescription = (description) => {
    return description.split(' ').slice(0, 10).join(' ') + (description.split(' ').length > 10 ? '...' : '');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="text-center py-4"><CircularProgress /></div>;
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;

  return (
    <>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">Pending Tasks</h1>

        {tasks.length === 0 ? (
          <div className="text-center text-lg font-medium text-gray-600">No pending tasks available.</div>
        ) : (
          <div className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition duration-200 ease-in-out">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{truncateDescription(task.description)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(task.dueDate)}</td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleClickOpen(task._id)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => handleViewClick(task.description)}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Task Description Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: handleDialogSubmit,
          }}
        >
          <DialogTitle>Submit Task</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please provide a description for submitting the task.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
            />
            {/* Linear Progress shown during submission */}
            {submitting && <LinearProgress />}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting}>Submit</Button>
          </DialogActions>
        </Dialog>

        {/* View Description Dialog */}
        <Dialog open={viewDialogOpen} onClose={handleViewClose}>
          <DialogTitle>Task Description</DialogTitle>
          <DialogContent>
            <DialogContentText>{viewDescription}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Employeetasks;
