import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, createHashRouter, RouterProvider, Navigate } from 'react-router'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App'
import HomePage from './pages/HomePage'
import CustomersPage from './pages/CustomersPage'
import TrainingsPage from './pages/TrainingsPage'
import CalendarPage from './pages/CalendarPage'
import StatisticsPage from './pages/StatisticsPage'
import './index.css'

const queryClient = new QueryClient()

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c3aed',
    },
    background: {
      default: '#0f172a',
      paper: '#111827',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },
})

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'trainings', element: <TrainingsPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'statistics', element: <StatisticsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]

const isGithubPages =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') || window.location.pathname.includes('/personal-trainer/'))

const router = isGithubPages ? createHashRouter(routes) : createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
