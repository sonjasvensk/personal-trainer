import { NavLink, Outlet } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'


const navItems = [
  { label: 'Etusivu', to: '/' },
  { label: 'Asiakkaat', to: '/customers' },
  { label: 'Harjoitukset', to: '/trainings' },
  { label: 'Kalenteri', to: '/calendar' },
  { label: 'Tilastot', to: '/statistics' },
]

function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(124, 58, 237, 0.24), transparent 35%), linear-gradient(180deg, #0f172a 0%, #020617 100%)',
      }}
    >
      <AppBar position="sticky" elevation={0} sx={{ backdropFilter: 'blur(16px)' }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Personal Trainer
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                color="inherit"
                sx={{
                  '&.active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            border: '1px solid rgba(148, 163, 184, 0.16)',
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <Outlet />
        </Paper>
      </Container>
    </Box>
  )
}

export default App
