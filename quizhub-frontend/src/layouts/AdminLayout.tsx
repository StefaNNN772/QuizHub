import React from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Container
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const AdminLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  
  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/admin' 
    },
    { 
      text: 'Manage Quizzes', 
      icon: <QuizIcon />, 
      path: '/admin/quizzes' 
    },
    { 
      text: 'User Results', 
      icon: <AssessmentIcon />, 
      path: '/admin/results' 
    },
    { 
      text: 'Return to App', 
      icon: <ArrowBackIcon />, 
      path: '/dashboard' 
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            QuizHub Admin Panel
          </Typography>
          <Typography variant="body2">
            Logged in as: {user?.username} (Admin)
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            QuizHub Admin
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              component={RouterLink} 
              to={item.path}
              selected={pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default', 
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` } 
        }}
      >
        <Toolbar /> {/* This is for spacing below the AppBar */}
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;