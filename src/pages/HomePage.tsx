import { Box, Card, CardContent, Stack, Typography } from '@mui/material'


function HomePage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
          Personal trainer-sovellus
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
          Tähän jotain
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
          gap: 2,
        }}
      >
        <Box>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mitä tähän tulee seuraavaksi
              </Typography>
              <Stack spacing={1} sx={{ color: 'text.secondary' }}>
                <Typography>• Asiakkaat</Typography>
                <Typography>• Harjoitukset </Typography>
                <Typography>• Kalenteri</Typography>
                <Typography>• Tilastot</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Stack>
  )
}

export default HomePage
