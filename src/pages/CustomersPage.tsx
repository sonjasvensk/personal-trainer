import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import type { Customer } from '../types'
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from '../api/hooks'

function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: customers = [], isLoading, error } = useCustomers()
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const deleteCustomer = useDeleteCustomer()

  const emptySelectionModel = { type: 'include' as const, ids: new Set<string>() }
  const [selectionModel, setSelectionModel] = useState<{ type: 'include' | 'exclude'; ids: Set<string> }>(
    emptySelectionModel
  )
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const emptyForm: Omit<Customer, 'id' | '_links'> = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    streetaddress: '',
    postcode: '',
    city: '',
  }

  const [form, setForm] = useState<Omit<Customer, 'id' | '_links'>>(emptyForm)

  const escapeCsvValue = (value: unknown) => {
    const text = value == null ? '' : String(value)
    return `"${text.replaceAll('"', '""')}"`
  }

  const exportCustomersAsCsv = () => {
    const headers = ['Etunimi', 'Sukunimi', 'Sähköposti', 'Puhelin', 'Osoite', 'Postinumero', 'Kaupunki']
    const rows = filteredCustomers.map(customer =>
      [
        customer.firstname,
        customer.lastname,
        customer.email,
        customer.phone,
        customer.streetaddress,
        customer.postcode,
        customer.city,
      ]
        .map(escapeCsvValue)
        .join(',')
    )
    const csv = [headers.map(escapeCsvValue).join(','), ...rows].join('\n')
    const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'asiakkaat.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const filteredCustomers = useMemo(() => {
    const withIds = customers.map(c => ({
      ...c,
      id: c._links?.self?.href?.split('/').pop() || Math.random(),
    }))
    if (!searchTerm) return withIds
    const term = searchTerm.toLowerCase()
    return withIds.filter(
      c =>
        c.firstname?.toLowerCase().includes(term) ||
        c.lastname?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term)
    )
  }, [customers, searchTerm])

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              color="primary"
              aria-label="muokkaa"
              onClick={() => {
                const row = params.row as Customer & { id?: string }
                setForm({
                  firstname: row.firstname || '',
                  lastname: row.lastname || '',
                  email: row.email || '',
                  phone: row.phone || '',
                  streetaddress: row.streetaddress || '',
                  postcode: row.postcode || '',
                  city: row.city || '',
                })
                setSelectionModel({ type: 'include', ids: new Set([String(row.id)]) })
                setOpenEdit(true)
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              aria-label="poista"
              onClick={() => {
                const row = params.row as Customer & { id?: string }
                setSelectionModel({ type: 'include', ids: new Set([String(row.id)]) })
                setOpenDelete(true)
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )
      },
    },
    { field: 'firstname', headerName: 'Etunimi', width: 130 },
    { field: 'lastname', headerName: 'Sukunimi', width: 130 },
    { field: 'email', headerName: 'Sähköposti', width: 200 },
    { field: 'phone', headerName: 'Puhelin', width: 130 },
    { field: 'streetaddress', headerName: 'Osoite', width: 180 },
    { field: 'postcode', headerName: 'Postinumero', width: 120 },
    { field: 'city', headerName: 'Kaupunki', width: 130 },
  ]

  if (error) {
    return (
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Asiakkaat
        </Typography>
        <Alert severity="error">Virhe: {error.message}</Alert>
      </Stack>
    )
  }

  return (
    <Stack spacing={2} sx={{ height: '100%', width: '100%' }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Asiakkaat
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Hae asiakkaita (nimi, sähköposti)"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          size="small"
          sx={{ width: '300px' }}
        />
        <Button variant="contained" onClick={() => { setForm(emptyForm); setOpenAdd(true) }}>
          Lisää asiakas
        </Button>
        <Button variant="outlined" onClick={exportCustomersAsCsv}>
          Lataa CSV
        </Button>
        <Button
          variant="outlined"
          disabled={(() => {
            const selectedIds = Array.from(selectionModel?.ids ?? [])
            return selectedIds.length !== 1
          })()}
          onClick={() => {
            const id = String(Array.from(selectionModel?.ids ?? [])[0])
            const row = filteredCustomers.find(r => String(r.id) === id)
            if (row) {
              setForm({
                firstname: row.firstname || '',
                lastname: row.lastname || '',
                email: row.email || '',
                phone: row.phone || '',
                streetaddress: row.streetaddress || '',
                postcode: row.postcode || '',
                city: row.city || '',
              })
              setOpenEdit(true)
            }
          }}
        >
          Muokkaa valittua
        </Button>
        <Button variant="outlined" color="error" disabled={(() => {
          const selectedIds = Array.from(selectionModel?.ids ?? [])
          return selectedIds.length !== 1
        })()} onClick={() => setOpenDelete(true)}>
          Poista valittu
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ flex: 1, width: '100%', minHeight: 0 }}>
          <DataGrid
            rows={filteredCustomers}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            checkboxSelection
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(newModel: any) => setSelectionModel(newModel)}
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

      {/* Add dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth>
        <DialogTitle>Lisää asiakas</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Etunimi" value={form.firstname} onChange={e => setForm({ ...form, firstname: e.target.value })} />
            <TextField label="Sukunimi" value={form.lastname} onChange={e => setForm({ ...form, lastname: e.target.value })} />
            <TextField label="Sähköposti" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <TextField label="Puhelin" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <TextField label="Osoite" value={form.streetaddress} onChange={e => setForm({ ...form, streetaddress: e.target.value })} />
            <TextField label="Postinumero" value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} />
            <TextField label="Kaupunki" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Peruuta</Button>
          <Button
            onClick={async () => {
              try {
                await createCustomer.mutateAsync(form)
                setOpenAdd(false)
                setForm(emptyForm)
              } catch (e) {
                // ignore - hooks will handle error display via react-query
              }
            }}
          >
            Tallenna
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
        <DialogTitle>Muokkaa asiakasta</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Etunimi" value={form.firstname} onChange={e => setForm({ ...form, firstname: e.target.value })} />
            <TextField label="Sukunimi" value={form.lastname} onChange={e => setForm({ ...form, lastname: e.target.value })} />
            <TextField label="Sähköposti" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <TextField label="Puhelin" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <TextField label="Osoite" value={form.streetaddress} onChange={e => setForm({ ...form, streetaddress: e.target.value })} />
            <TextField label="Postinumero" value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} />
            <TextField label="Kaupunki" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Peruuta</Button>
          <Button
            onClick={async () => {
              try {
                const id = Array.from(selectionModel.ids ?? [])[0]
                await updateCustomer.mutateAsync({ id: Number(id), customer: form })
                setOpenEdit(false)
              } catch (e) {}
            }}
          >
            Tallenna
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Poista asiakas</DialogTitle>
        <DialogContent>Haluatko varmasti poistaa valitun asiakkaan?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Peruuta</Button>
          <Button
            color="error"
            onClick={async () => {
              try {
                const id = Array.from(selectionModel.ids ?? [])[0]
                await deleteCustomer.mutateAsync(Number(id))
                setOpenDelete(false)
                setSelectionModel(emptySelectionModel)
              } catch (e) {}
            }}
          >
            Poista
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default CustomersPage
