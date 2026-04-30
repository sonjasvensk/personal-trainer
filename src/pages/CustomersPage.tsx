import { useState, useMemo } from 'react'
import { Box, CircularProgress, Stack, TextField, Typography, Alert } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useCustomers } from '../api/hooks'

function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: customers = [], isLoading, error } = useCustomers()

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

      <TextField
        placeholder="Hae asiakkaita (nimi, sähköposti)"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        size="small"
        sx={{ width: '300px' }}
      />

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

export default CustomersPage
