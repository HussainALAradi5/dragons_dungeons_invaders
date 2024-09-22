import { Box, Grid, useBreakpointValue, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Dragon from './Dragon'
import Archers from './Archers'
import Difficulties from './Difficulties'
import ResultLogic from './ResultLogic'
import { FaFire, FaArrowDown } from 'react-icons/fa'

const GameBoard = () => {
  const [difficulty, setDifficulty] = useState(null)
  const [enemiesDefeated, setEnemiesDefeated] = useState(0)
  const [lives, setLives] = useState(0)
  const [dragonPosition, setDragonPosition] = useState(72)
  const [archersPositions, setArchersPositions] = useState([])
  const [projectiles, setProjectiles] = useState([])
  const [arrows, setArrows] = useState([])
  const [archerSpeed, setArcherSpeed] = useState(0)
  const [countdown, setCountdown] = useState(5)
  const [gameStarted, setGameStarted] = useState(false)
  const toast = useToast()

  const resetGame = () => {
    setDifficulty(null)
    setLives(0)
    setDragonPosition(72)
    setArchersPositions([])
    setProjectiles([])
    setArrows([])
    setArcherSpeed(0)
    setCountdown(5)
    setGameStarted(false)
    setEnemiesDefeated(0)
  }

  useEffect(() => {
    if (difficulty) {
      setGameStarted(false)
      setCountdown(5)
    }
  }, [difficulty])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (countdown === 0 && difficulty) {
      setGameStarted(true)
    }
  }, [countdown, difficulty])

  useEffect(() => {
    if (gameStarted) {
      switch (difficulty) {
        case 'Easy':
          setLives(10)
          setArchersPositions([...Array(4).keys()])
          setArcherSpeed(2300)
          break
        case 'Normal':
          setLives(5)
          setArchersPositions([...Array(7).keys()])
          setArcherSpeed(2100)
          break
        case 'Expert':
          setLives(3)
          setArchersPositions([...Array(9).keys()])
          setArcherSpeed(1950)
          break
        default:
          break
      }
    }
  }, [gameStarted, difficulty])

  useEffect(() => {
    if (!gameStarted) return

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
  }, [archerSpeed, gameStarted])

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
    if (!gameStarted) return

    const interval = setInterval(() => {
      setProjectiles((prev) =>
        prev
          .map((p) => ({ ...p, position: p.position - 9 }))
          .filter((p) => p.position >= 0)
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [gameStarted])

  useEffect(() => {
    if (!gameStarted) return

    const interval = setInterval(() => {
      setArrows((prev) =>
        prev
          .map((a) => ({ ...a, position: a.position + 9 }))
          .filter((a) => a.position < 81)
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [gameStarted])

  useEffect(() => {
    if (!gameStarted) return

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
  }, [archersPositions, archerSpeed, gameStarted])

  useEffect(() => {
    if (!gameStarted) return

    setProjectiles((prevProjectiles) =>
      prevProjectiles.filter((p) => {
        const collision = archersPositions.includes(p.position)
        if (collision) {
          setArchersPositions((prev) =>
            prev.map((pos) => (pos === p.position ? -1 : pos))
          )
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
              isClosable: true,
              position: 'top'
            })
            resetGame()
          }
          return false
        }
        return true
      })
    )

    if (archersPositions.filter((pos) => pos === -1).length > 0) {
      setArchersPositions((prev) => {
        const numRequired =
          difficulty === 'Easy' ? 3 : difficulty === 'Normal' ? 5 : 7
        const numCurrent = prev.filter((pos) => pos >= 0).length

        if (numCurrent < numRequired) {
          let updatedPositions = [...prev]
          const firstEmptyIndex = updatedPositions.indexOf(-1)

          if (firstEmptyIndex !== -1) {
            updatedPositions[firstEmptyIndex] = 0
          } else {
            updatedPositions = updatedPositions.map((pos) =>
              pos === -1 ? 0 : pos
            )
          }
          return updatedPositions
        }
        return prev
      })
    }
  }, [
    projectiles,
    arrows,
    dragonPosition,
    archersPositions,
    lives,
    gameStarted,
    difficulty
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
      {!gameStarted ? (
        <Box>
          {!difficulty && (
            <Difficulties
              onSelectDifficulty={(level) => {
                setDifficulty(level)
              }}
            />
          )}
          {difficulty && countdown > 0 && (
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="rgba(0, 0, 0, 0.7)"
              color="white"
              p="4"
              borderRadius="md"
              textAlign="center"
              fontSize="4xl"
            >
              {countdown}
            </Box>
          )}
        </Box>
      ) : (
        <Box>
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
                  <FaFire size={iconSize} color="red" />
                )}
                {arrows.some((a) => a.position === index) && (
                  <FaArrowDown size={iconSize} color="gray" />
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
      )}
    </Box>
  )
}

export default GameBoard
