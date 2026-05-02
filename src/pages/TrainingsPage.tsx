import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { fi } from 'date-fns/locale'
import { useTrainingsWithCustomers, useCreateTraining, useDeleteTraining, useCustomers } from '../api/hooks'

function TrainingsPage() {
  const { data: trainings = [], isLoading, error } = useTrainingsWithCustomers()
  const { data: customers = [] } = useCustomers()
  const createTraining = useCreateTraining()
  const deleteTraining = useDeleteTraining()

  const emptySelectionModel = { type: 'include' as const, ids: new Set<string>() }
  const [selectionModel, setSelectionModel] = useState<{ type: 'include' | 'exclude'; ids: Set<string> }>(
    emptySelectionModel
  )

  const [openAdd, setOpenAdd] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const [form, setForm] = useState({
    date: '',
    duration: 60,
    activity: '',
    customerId: undefined as number | undefined,
  })

  const rows = useMemo(
    () =>
      trainings.map((training, index) => ({
        ...training,
        id: training._links?.self?.href?.split('/').pop() ?? `${training.date}-${training.activity}-${index}`,
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
            getRowId={row => row.id}
            checkboxSelection
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(newModel: any) => setSelectionModel(newModel)}
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

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => { setForm({ date: '', duration: 60, activity: '', customerId: undefined }); setOpenAdd(true) }}>
          Lisää harjoitus
        </Button>
        <Button variant="outlined" color="error" disabled={Array.from(selectionModel.ids).length !== 1} onClick={() => setOpenDelete(true)}>
          Poista valittu
        </Button>
      </Box>

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth>
        <DialogTitle>Lisää harjoitus</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Pvm ja aika"
              type="datetime-local"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
            <TextField label="Kesto (min)" type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} />
            <TextField label="Laji" value={form.activity} onChange={e => setForm({ ...form, activity: e.target.value })} />
            <TextField select label="Asiakas" value={form.customerId ?? ''} onChange={e => setForm({ ...form, customerId: Number(e.target.value) })}>
              <MenuItem value="">Valitse asiakas</MenuItem>
              {customers.map(c => (
                <MenuItem key={c._links?.self?.href} value={Number(c._links?.self?.href?.split('/').pop())}>{`${c.firstname} ${c.lastname}`}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Peruuta</Button>
          <Button onClick={async () => {
            try {
              if (!form.customerId || !form.date) return
              // HTML datetime-local gives local date like "2026-05-02T10:00" — convert to ISO
              const iso = new Date(form.date).toISOString()
              await createTraining.mutateAsync({ training: { date: iso, duration: form.duration, activity: form.activity }, customerId: form.customerId })
              setOpenAdd(false)
            } catch (e) {}
          }}>Tallenna</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Poista harjoitus</DialogTitle>
        <DialogContent>Haluatko varmasti poistaa valitun harjoituksen?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Peruuta</Button>
          <Button color="error" onClick={async () => {
            try {
              const id = Array.from(selectionModel.ids ?? [])[0]
              await deleteTraining.mutateAsync(Number(id))
              setOpenDelete(false)
              setSelectionModel(emptySelectionModel)
            } catch (e) {}
          }}>Poista</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default TrainingsPage
