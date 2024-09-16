import { Box, Grid, useBreakpointValue } from '@chakra-ui/react'
import { useState } from 'react'
import Dragon from './Dragon'
import Archers from './Archers'
import Difficulties from './Difficulties'
import ResultLogic from './ResultLogic'

const GameBoard = () => {
  const [difficulty, setDifficulty] = useState('Easy')
  const [enemiesDefeated, setEnemiesDefeated] = useState(0)
  const [lives, setLives] = useState(10)
  const [dragonPosition, setDragonPosition] = useState(72)

  const cellSize = useBreakpointValue({
    base: '30px',
    sm: '40px',
    md: '50px',
    lg: '60px'
  })

  const iconSize = `calc(${cellSize} * 0.45)`

  const handleFire = () => {
    console.log('Fire!')
  }

  const handleMove = (direction) => {
    if (direction === 'left' && dragonPosition % 9 !== 0) {
      setDragonPosition(dragonPosition - 1)
    } else if (direction === 'right' && dragonPosition % 9 !== 8) {
      setDragonPosition(dragonPosition + 1)
    }
  }

  const outerBoxStyle = {
    width: '100vw',
    height: '100vh',
    bgGradient: 'linear(to-br, purple.400, purple.600)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }

  const gridStyle = {
    gridTemplateColumns: `repeat(9, ${cellSize})`,
    gridTemplateRows: `repeat(9, ${cellSize})`,
    gap: useBreakpointValue({ base: '1px', md: '2px' }),
    bg: 'whiteAlpha.800',
    padding: useBreakpointValue({ base: '1', md: '2' }),
    borderRadius: 'md',
    boxShadow: 'md',
    maxHeight: '90vh',
    maxWidth: '90vw'
  }

  return (
    <Box sx={outerBoxStyle}>
      <Box>
        <Difficulties onSelectDifficulty={setDifficulty} />
        <Grid sx={gridStyle}>
          {[...Array(81)].map((_, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bg="gray.100"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.300"
            >
              {index === dragonPosition && (
                <Dragon
                  iconSize={iconSize}
                  onFire={handleFire}
                  onMove={handleMove}
                />
              )}
              {index < 9 && <Archers iconSize={iconSize} position={index} />}
            </Box>
          ))}
        </Grid>
        <ResultLogic lives={lives} enemiesDefeated={enemiesDefeated} />
      </Box>
    </Box>
  )
}

export default GameBoard
