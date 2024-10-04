import React, { useState, useEffect } from 'react';
import { memo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  console.log("render")
  const { user, apiCall } = useAuth();
  const [counters, setCounters] = useState({});
  const [error, setError] = useState(null);
  const adminId = user?.id;

  const cardData = [
    {
      title: "department",
      description: "Total Departments",
      color: "#ffcccb",
      icon: <FormatAlignLeftIcon />,
      fetchData: () => apiCall('/departments/getdepartmentsonly', {
        method: "GET"
      }).then(response => response?.data.result ?? 0)
    },
    {
      title: "staff",
      description: "Total Employees",
      color: "#ccffcc",
      icon: <ContentPasteIcon />,
      fetchData: () => apiCall('/Admin/getemployeeonly', {
        method: "GET"
      }).then(response => response?.data.result  ?? 0)
    },
    {
      title: "leaves",
      description: "Total leaves",
      color: "#ffcccb",
      icon: <FormatAlignLeftIcon />,
      fetchData: () => apiCall(`/leave/getCountofManageleaves/${adminId}`, {
        method: "GET"
      }).then(response => response?.data.result ?? 0)
    },
    // {
    //   title: "salary",
    //   description: "Salary Paid",
    //   color: "#ffcccb",
    //   icon: <FormatAlignLeftIcon />,
    //   fetchData: () => apiCall('http://localhost:3000/departments', {
    //     method: "GET"
    //   }).then(response => response?.result ?? 0)
    // }
  ];

  useEffect(() => {
    if (user) {
      console.log("Fetching data for user:", user);
      Promise.all(
        cardData.map(card =>
          card.fetchData()
            .then(count => {
              console.log(`Fetched ${card.title} count:`, count);
              return { title: card.title, count: count || 0 };
            })
            .catch(error => {
              console.error(`Error fetching ${card.title} data:`, error);
              return { title: card.title, count: 'Error' };
            })
        )
      ).then(results => {
        const newCounters = results.reduce((acc, { title, count }) => {
          acc[title] = count;
          return acc;
        }, {});
        console.log("New counters:", newCounters); // Add this line
        setCounters(newCounters);
      }).catch(err => setError(err.message));
    } else {
      setError('You are not authorized to view this content.');
    }
  }, [user]);

  return (
    <div>
      <Box sx={{ flexGrow: 1, p: 8 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {cardData.map((card, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Card sx={{
                maxWidth: 345,
                bgcolor: card.color,
                boxShadow: 3,
                borderRadius: 2,
                '&:hover': {
                  cursor: 'pointer',
                  boxShadow: 6,
                  transform: 'scale(1.05)',
                  transition: 'transform 0.3s ease-in-out',
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ mr: 2 }}>
                      {card.icon}
                    </Box>
                    <Typography gutterBottom variant="h6" component="div" className="text-sm">
                      {card.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                  <Typography variant="h6" color="text.primary">
                  {counters[card.title] !== undefined ? counters[card.title] : 'Loading...'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {error && <Typography color="error">Error: {error}</Typography>}
        </Grid>
      </Box>
    </div>
  );
}

export default Dashboard;
