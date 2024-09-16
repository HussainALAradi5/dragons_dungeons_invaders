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
  const [projectiles, setProjectiles] = useState([])
  const [arrows, setArrows] = useState([])
  const [archerSpeed, setArcherSpeed] = useState(1000)
  const [respawnQueue, setRespawnQueue] = useState([])

  const toast = useToast()

  useEffect(() => {
    switch (difficulty) {
      case 'Easy':
        setLives(10)
        setArchersPositions([...Array(4).keys()])
        setArcherSpeed(2000)
        break
      case 'Normal':
        setLives(5)
        setArchersPositions([...Array(7).keys()])
        setArcherSpeed(1600)
        break
      case 'Expert':
        setLives(3)
        setArchersPositions([...Array(9).keys()])
        setArcherSpeed(1400)
        break
      default:
        break
    }
  }, [difficulty])

  useEffect(() => {
    const moveArchers = () => {
      setArchersPositions((prevPositions) => {
        const updatedPositions = prevPositions.map((pos) => {
          const rowIndex = Math.floor(pos / 9)
          const colIndex = pos % 9
          const newColIndex = colIndex + 1

          if (newColIndex > 8) {
            if (rowIndex + 1 >= 9) {
              return rowIndex * 9
            }
            return (rowIndex + 1) * 9
          }
          return pos + 1
        })

        return updatedPositions
      })
    }

    const interval = setInterval(moveArchers, archerSpeed)
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

  useEffect(() => {
    const interval = setInterval(() => {
      setProjectiles((prev) =>
        prev
          .map((p) => ({ ...p, position: p.position - 9 }))
          .filter((p) => p.position >= 0)
      )
    }, 200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setArrows((prev) =>
        prev
          .map((a) => ({ ...a, position: a.position + 9 }))
          .filter((a) => a.position < 81)
      )
    }, 300)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const shootArrows = () => {
      setArrows((prevArrows) => [
        ...prevArrows,
        ...archersPositions.map((pos) => ({
          position: pos + 9,
          id: Date.now() + pos
        }))
      ])
    }

    shootArrows()
    const interval = setInterval(shootArrows, archerSpeed)
    return () => clearInterval(interval)
  }, [archersPositions, archerSpeed])

  useEffect(() => {
    setProjectiles((prevProjectiles) =>
      prevProjectiles.filter((p) => {
        const collision = archersPositions.includes(p.position)
        if (collision) {
          setArchersPositions((prev) =>
            prev.map((pos) => (pos === p.position ? -1 : pos))
          )
          setRespawnQueue((queue) => [...queue, { id: Date.now() }])
          setEnemiesDefeated((prev) => prev + 1)
        }
        return !collision
      })
    )

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

    if (!archersPositions.includes(0) && respawnQueue.length > 0) {
      setArchersPositions((prev) => prev.map((pos) => (pos === -1 ? 0 : pos)))
      setRespawnQueue((queue) => queue.slice(1))
    }
  }, [
    projectiles,
    arrows,
    dragonPosition,
    archersPositions,
    lives,
    respawnQueue,
    toast
  ])

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
                <FaFire size={iconSize} color="red.500" />
              )}
              {arrows.some((a) => a.position === index) && (
                <FaArrowDown size={iconSize} color="blue.500" />
              )}
            </Box>
          ))}
        </Grid>
        <ResultLogic
          enemiesDefeated={enemiesDefeated}
          lives={lives}
          difficulty={difficulty}
        />
      </Box>
    </Box>
  )
}

export default GameBoard
