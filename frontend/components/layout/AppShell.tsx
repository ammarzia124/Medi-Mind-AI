import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Drawer, 
  useMediaQuery, 
  useTheme,
  alpha
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { colors, spacing } from '../../theme/designTokens';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showSidebar?: boolean;
}

const DRAWER_WIDTH = 280;

export const AppShell: React.FC<AppShellProps> = ({
  children,
  title = 'MediMind AI',
  showHeader = true,
  showSidebar = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header */}
      {showHeader && (
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{
            zIndex: theme.zIndex.appBar,
            backgroundColor: colors.background.paper,
            borderBottom: `1px solid ${colors.border.main}`,
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 64, sm: 72 } }}>
            {isMobile && showSidebar && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open menu"
                onClick={handleToggleMobileMenu}
                sx={{ mr: 2 }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}
            
            <Typography 
              variant="h6" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                color: colors.primary.main,
                flexGrow: 1,
              }}
            >
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar - Desktop */}
      {showSidebar && !isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              mt: { xs: '64px', sm: '72px' },
              height: `calc(100% - ${isMobile ? '64px' : '72px'})`,
              borderRight: `1px solid ${colors.border.main}`,
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: colors.text.secondary }}>
              Navigation
            </Typography>
            {/* Navigation items will be added here */}
          </Box>
        </Drawer>
      )}

      {/* Sidebar - Mobile */}
      {showSidebar && isMobile && (
        <Drawer
          variant="temporary"
          open={mobileMenuOpen}
          onClose={handleToggleMobileMenu}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: colors.text.secondary }}>
              Navigation
            </Typography>
            {/* Navigation items will be added here */}
          </Box>
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { 
            md: `calc(100% - ${showSidebar ? DRAWER_WIDTH : 0}px)` 
          },
          mt: showHeader ? { xs: '64px', sm: '72px' } : 0,
          backgroundColor: colors.background.default,
          minHeight: '100vh',
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppShell;
