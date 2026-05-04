import { useMemo } from 'react'
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { TrainingWithCustomer } from '../types'
import { useTrainingsWithCustomers } from '../api/hooks'

interface StatItem {
  activity: string
  kesto_min: number
  lukumäärä: number
}

const groupByActivity = (trainings: TrainingWithCustomer[]): Record<string, TrainingWithCustomer[]> => {
  return trainings.reduce((acc, training) => {
    const key = training.activity
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(training)
    return acc
  }, {} as Record<string, TrainingWithCustomer[]>)
}

function StatisticsPage() {
  const { data: trainings = [], isLoading, error } = useTrainingsWithCustomers()

  const stats = useMemo<StatItem[]>(() => {
    if (!trainings.length) return []

    const grouped = groupByActivity(trainings)
    return Object.entries(grouped).map(([activity, items]) => ({
      activity,
      kesto_min: items.reduce((sum, item) => sum + item.duration, 0),
      lukumäärä: items.length,
    }))
  }, [trainings])

  if (error) {
    return (
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Tilastot
        </Typography>
        <Alert severity="error">Virhe: {error.message}</Alert>
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Tilastot
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : stats.length === 0 ? (
        <Alert severity="info">Tilastoissa ei ole vielä treenejä.</Alert>
      ) : (
        <Stack spacing={2}>
          <Box sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Yhteensä {trainings.length} harjoitusta, {stats.reduce((sum, s) => sum + s.kesto_min, 0)} minuuttia.
            </Typography>
          </Box>

          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="activity"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                  }}
                  labelStyle={{ color: '#cbd5e1' }}
                  formatter={(value) => `${value} min`}
                />
                <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                <Bar dataKey="kesto_min" fill="#8b5cf6" name="Kesto (min)" />
                <Bar dataKey="lukumäärä" fill="#06b6d4" name="Lukumäärä" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Aktiviteetit
            </Typography>
            <Stack spacing={1}>
              {stats.map(stat => (
                <Box
                  key={stat.activity}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 1,
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                  }}
                >
                  <Typography>{stat.activity}</Typography>
                  <Typography sx={{ color: '#94a3b8' }}>
                    {stat.lukumäärä} x {stat.kesto_min} min
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      )}
    </Stack>
  )
}

export default StatisticsPage
