import { Box, Grid, useBreakpointValue, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Dragon from './Dragon'
import Archers from './Archers'
import Difficulties from './Difficulties'
import ResultLogic from './ResultLogic'
import { FaFire } from 'react-icons/fa'
import { FaArrowDown } from 'react-icons/fa'

const GameBoard = () => {
  const [difficulty, setDifficulty] = useState('Easy')
  const [enemiesDefeated, setEnemiesDefeated] = useState(0)
  const [lives, setLives] = useState(10)
  const [dragonPosition, setDragonPosition] = useState(72)
  const [archersPositions, setArchersPositions] = useState([...Array(9).keys()])
  const [projectiles, setProjectiles] = useState([]) // Player's fire
  const [arrows, setArrows] = useState([]) // Archer's arrows
  const [archerSpeed, setArcherSpeed] = useState(1000)
  const toast = useToast()

  useEffect(() => {
    switch (difficulty) {
      case 'Easy':
        setLives(10)
        setArchersPositions([...Array(4).keys()])
        setArcherSpeed(1000)
        break
      case 'Normal':
        setLives(5)
        setArchersPositions([...Array(7).keys()])
        setArcherSpeed(700)
        break
      case 'Expert':
        setLives(3)
        setArchersPositions([...Array(9).keys()])
        setArcherSpeed(500)
        break
      default:
        break
    }
  }, [difficulty])

  // Archer movement logic (moving left to right, row by row)
  useEffect(() => {
    const interval = setInterval(() => {
      setArchersPositions((prevPositions) => {
        return prevPositions.map((pos) => {
          const isEndOfRow = pos % 9 === 8 // Archer is at the end of the row
          if (isEndOfRow) {
            const nextPos = pos + 1 < 81 ? pos + 1 : pos % 9 // Move to the next row or wrap around
            return nextPos
          } else {
            return pos + 1 // Move to the right within the same row
          }
        })
      })
    }, archerSpeed)

    return () => clearInterval(interval)
  }, [archerSpeed])

  const cellSize = useBreakpointValue({
    base: '30px',
    sm: '40px',
    md: '50px',
    lg: '60px'
  })

  const iconSize = `calc(${cellSize} * 0.45)`

  const handleFire = () => {
    setProjectiles((prev) => [
      ...prev,
      { position: dragonPosition, id: Date.now() }
    ])
  }

  const handleMove = (direction) => {
    if (direction === 'left' && dragonPosition % 9 !== 0) {
      setDragonPosition(dragonPosition - 1)
    } else if (direction === 'right' && dragonPosition % 9 !== 8) {
      setDragonPosition(dragonPosition + 1)
    }
  }

  // Move projectiles (dragon's fire)
  useEffect(() => {
    const interval = setInterval(() => {
      setProjectiles(
        (prev) =>
          prev
            .map((p) => ({ ...p, position: p.position - 9 })) // Move upward
            .filter((p) => p.position >= 0) // Remove off-screen projectiles
      )
    }, 200)
    return () => clearInterval(interval)
  }, [])

  // Move arrows (archers' arrows)
  useEffect(() => {
    const interval = setInterval(() => {
      setArrows(
        (prev) =>
          prev
            .map((a) => ({ ...a, position: a.position + 9 })) // Move downward
            .filter((a) => a.position < 81) // Remove off-screen arrows
      )
    }, 300)
    return () => clearInterval(interval)
  }, [])

  // Archer arrows fire logic
  useEffect(() => {
    const interval = setInterval(() => {
      setArrows((prevArrows) => [
        ...prevArrows,
        ...archersPositions.map((pos) => ({
          position: pos,
          id: Date.now() + pos
        }))
      ])
    }, 2000) // Archers shoot every 2 seconds
    return () => clearInterval(interval)
  }, [archersPositions])

  // Collision Detection
  useEffect(() => {
    // Check for collisions between projectiles and archers
    setProjectiles((prevProjectiles) =>
      prevProjectiles.filter((p) => {
        const collision = archersPositions.includes(p.position)
        if (collision) {
          setArchersPositions(
            (prev) =>
              prev.map((pos) =>
                pos === p.position ? Math.floor(Math.random() * 9) : pos
              ) // Respawn at a random position
          )
          setEnemiesDefeated((prev) => prev + 1)
        }
        return !collision
      })
    )

    // Check for collisions between arrows and the dragon
    setArrows((prevArrows) =>
      prevArrows.filter((a) => {
        const collision = a.position === dragonPosition
        if (collision) {
          setLives((prev) => prev - 1)
          if (lives <= 1) {
            toast({
              title: 'Game Over',
              status: 'error',
              duration: 2000,
              isClosable: true,
              position: 'top'
            })
          }
          return false
        }
        return true
      })
    )
  }, [projectiles, arrows, dragonPosition, archersPositions, lives, toast])

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
        <Difficulties
          onSelectDifficulty={(level) => {
            setDifficulty(level)
            toast({
              title: `Difficulty set to ${level}`,
              status: 'success',
              duration: 2000,
              isClosable: true,
              position: 'top'
            })
          }}
        />
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
              {archersPositions.includes(index) && (
                <Archers iconSize={iconSize} />
              )}
              {projectiles.some((p) => p.position === index) && (
                <FaFire color="red.500" fontSize={iconSize} />
              )}
              {arrows.some((a) => a.position === index) && (
                <FaArrowDown color="blue.500" fontSize={iconSize} />
              )}
            </Box>
          ))}
        </Grid>
        <ResultLogic lives={lives} enemiesDefeated={enemiesDefeated} />
      </Box>
    </Box>
  )
}

export default GameBoard
