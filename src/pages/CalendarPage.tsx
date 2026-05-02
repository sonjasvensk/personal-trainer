import { useMemo } from 'react'
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { fi } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useTrainingsWithCustomers } from '../api/hooks'

const locales = {
  'fi': fi,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

function CalendarPage() {
  const { data: trainings = [], isLoading, error } = useTrainingsWithCustomers()

  const events = useMemo(
    () =>
      trainings.map(training => {
        const start = new Date(training.date)
        const end = new Date(start.getTime() + training.duration * 60_000)
        const customerName =
          training.customer && typeof training.customer === 'object'
            ? `${(training.customer as any).firstname ?? ''} ${(training.customer as any).lastname ?? ''}`.trim()
            : ''
        return {
          id: training._links?.self?.href?.split('/').pop() ?? Math.random(),
          title: `${training.activity}${customerName ? ` - ${customerName}` : ''}`,
          start,
          end,
          resource: training,
        }
      }),
    [trainings]
  )

  if (error) {
    return (
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Kalenteri
        </Typography>
        <Alert severity="error">Virhe: {error.message}</Alert>
      </Stack>
    )
  }

  return (
    <Stack spacing={2} sx={{ height: '100%', width: '100%' }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Kalenteri
      </Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ flex: 1, width: '100%', minHeight: 0, '& .rbc-calendar': { height: '100%' } }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            defaultView="month"
            defaultDate={new Date()}
          />
        </Box>
      )}
    </Stack>
  )
}

export default CalendarPage
