import { Box } from '@chakra-ui/react'
import { FaDragon } from 'react-icons/fa'
import { useEffect } from 'react'

const Dragon = ({ iconSize, onFire, onMove }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
      onMove('left')
    } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
      onMove('right')
    } else if (e.key === ' ') {
      onFire()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Box>
      <FaDragon color="red.500" fontSize={iconSize} />
    </Box>
  )
}

export default Dragon
