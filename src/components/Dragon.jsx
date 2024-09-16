import { useEffect } from 'react'
import { FaDragon } from 'react-icons/fa'

const Dragon = ({ iconSize, onFire, onMove }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
      onMove('left')
    } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
      onMove('right')
    } else if (event.key === ' ' || event.type === 'click') {
      onFire()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return <FaDragon color="red.500" fontSize={iconSize} onClick={onFire} />
}

export default Dragon
