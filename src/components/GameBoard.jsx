import React from 'react'
import { Box, Grid, useBreakpointValue } from '@chakra-ui/react'
import { FaDragon, FaArrowAltCircleRight } from 'react-icons/fa'
import { GiArcher } from 'react-icons/gi'

const GameBoard = () => {
  const cellSize = useBreakpointValue({ base: '60px', md: '80px' })

  const iconSize = `calc(${cellSize} * 0.45)`

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
    gap: '2px',
    bg: 'whiteAlpha.800',
    padding: '4',
    borderRadius: 'md',
    boxShadow: 'md'
  }

  const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid',
    borderColor: 'gray.300',
    bg: 'gray.100',
    borderRadius: 'md',
    minWidth: cellSize,
    minHeight: cellSize
  }

  return (
    <Box sx={outerBoxStyle}>
      <Grid sx={gridStyle}>
        {[...Array(81)].map((_, index) => (
          <Box key={index} sx={cellStyle}>
            {index === 0 && <FaDragon color="red.500" fontSize={iconSize} />}
            {index === 1 && <GiArcher color="green.500" fontSize={iconSize} />}
            {index === 2 && (
              <FaArrowAltCircleRight color="orange.500" fontSize={iconSize} />
            )}
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

export default GameBoard
