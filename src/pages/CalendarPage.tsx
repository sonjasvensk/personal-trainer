import { useMemo, useState } from 'react'
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import type { View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { fi } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useTrainingsWithCustomers } from '../api/hooks'
import type { TrainingWithCustomer } from '../types'

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

const getCustomerName = (training: TrainingWithCustomer) => {
  if (!training.customer || typeof training.customer !== 'object') {
    return ''
  }

  const { firstname = '', lastname = '' } = training.customer
  return `${firstname} ${lastname}`.trim()
}

function CalendarPage() {
  const { data: trainings = [], isLoading, error } = useTrainingsWithCustomers()
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState<View>('month')

  const events = useMemo(
    () =>
      trainings.map(training => {
        const start = new Date(training.date)
        const end = new Date(start.getTime() + training.duration * 60_000)
        const customerName = getCustomerName(training)
        return {
          id: training._links?.self?.href?.split('/').pop() ?? `${training.date}-${training.activity}`,
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
      ) : events.length === 0 ? (
        <Alert severity="info">Kalenterissa ei ole vielä treenejä.</Alert>
      ) : (
        <Box
          sx={{
            width: '100%',
            minHeight: { xs: 560, md: 700 },
            height: { xs: '72vh', md: '78vh' },
            '& .rbc-off-range': {
              color: '#64748b',
            },
            '& .rbc-off-range-bg': {
              backgroundColor: 'rgba(15, 23, 42, 0.34)',
            },
            '& .rbc-day-bg': {
              backgroundColor: 'rgba(15, 23, 42, 0.18)',
            },
            '& .rbc-calendar': { height: '100%' },
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            date={date}
            view={view}
            onNavigate={nextDate => setDate(nextDate)}
            onView={nextView => setView(nextView)}
            views={['month', 'week', 'day']}
          />
        </Box>
      )}
    </Stack>
  )
}

export default CalendarPage
