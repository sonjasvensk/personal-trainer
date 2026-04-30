import { useMemo } from 'react'
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { fi } from 'date-fns/locale'
import { useTrainingsWithCustomers } from '../api/hooks'

function TrainingsPage() {
  const { data: trainings = [], isLoading, error } = useTrainingsWithCustomers()

  const rows = useMemo(
    () =>
      trainings.map((training, index) => ({
        ...training,
        rowId: training._links?.self?.href ?? `${training.date}-${training.activity}-${index}`,
      })),
    [trainings]
  )

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Pvm ja aika',
      width: 180,
      valueFormatter: value => {
        const date = new Date(value as string)
        if (Number.isNaN(date.getTime())) {
          return String(value)
        }
        return format(date, 'dd.MM.yyyy HH:mm', { locale: fi })
      },
    },
    {
      field: 'duration',
      headerName: 'Kesto (min)',
      width: 120,
    },
    {
      field: 'activity',
      headerName: 'Laji',
      width: 160,
      flex: 1,
    },
    {
      field: 'customer',
      headerName: 'Asiakas',
      width: 220,
      valueGetter: value => {
        if (!value || typeof value !== 'object') {
          return '-'
        }
        const customer = value as { firstname?: string; lastname?: string }
        return `${customer.firstname ?? ''} ${customer.lastname ?? ''}`.trim() || '-'
      },
    },
  ]

  if (error) {
    return (
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Harjoitukset
        </Typography>
        <Alert severity="error">Virhe: {error.message}</Alert>
      </Stack>
    )
  }

  return (
    <Stack spacing={2} sx={{ height: '100%', width: '100%' }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Harjoitukset
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ flex: 1, width: '100%', minHeight: 0 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={row => row.rowId}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
            }}
            disableRowSelectionOnClick
            sx={{
              backgroundColor: '#1e293b',
              '& .MuiDataGrid-cell': {
                borderColor: '#334155',
              },
              '& .MuiDataGrid-columnHeader': {
                borderColor: '#334155',
                backgroundColor: '#0f172a',
              },
              '& .MuiTablePagination-root': {
                color: '#cbd5e1',
              },
            }}
          />
        </Box>
      )}
    </Stack>
  )
}

export default TrainingsPage
