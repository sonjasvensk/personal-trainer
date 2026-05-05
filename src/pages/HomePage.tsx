import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import PeopleIcon from '@mui/icons-material/People'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import BarChartIcon from '@mui/icons-material/BarChart'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  path: string
}

const features: Feature[] = [
  {
    icon: <PeopleIcon sx={{ fontSize: 32, color: '#8b5cf6' }} />,
    title: 'Asiakkaat',
    description: 'Hallinnoi asiakkaiden yhteystietoja. Lisää, muokkaa ja poista asiakkaita sekä vie lista CSV-muodossa.',
    path: '/customers',
  },
  {
    icon: <FitnessCenterIcon sx={{ fontSize: 32, color: '#06b6d4' }} />,
    title: 'Harjoitukset',
    description: 'Seuraa harjoittelua aktiviteettilajeittain. Tallenna harjoituksien kestot ja liitä ne asiakkaisiin.',
    path: '/trainings',
  },
  {
    icon: <CalendarMonthIcon sx={{ fontSize: 32, color: '#ec4899' }} />,
    title: 'Kalenteri',
    description: 'Visualisoi harjoitukset kalenterinäkymässä. Vaihda kuukausi-, viikko- ja päivänäkymien välillä.',
    path: '/calendar',
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 32, color: '#f59e0b' }} />,
    title: 'Tilastot',
    description: 'Seuraa harjoittelun tilastoja. Näe kokonaisajat ja harjoitusten määrä aktiviteettien mukaan ryhmiteltynä.',
    path: '/statistics',
  },
]

function HomePage() {
  const navigate = useNavigate()

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
          Personal Trainer -sovellus
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.6 }}>
          Tervetuloa henkilökohtaisen valmentajan hallintojärjestelmään. Tämä sovellus auttaa sinua hallitsemaan asiakasta, 
          seuraamaan heidän harjoittelunsa, visualisoimaan kehitystä ja analysoimaan tilastoja. 
          Kaikki tiedot näkyvät kauniissa ja käyttäjäystävällisessä käyttöliittymässä.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        {features.map(feature => (
          <Card
            key={feature.title}
            variant="outlined"
            onClick={() => navigate(feature.path)}
            sx={{
              height: '100%',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                borderColor: '#8b5cf6',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
              },
            }}
          >
            <CardContent>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {feature.icon}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {feature.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  {feature.description}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  )
}

export default HomePage
