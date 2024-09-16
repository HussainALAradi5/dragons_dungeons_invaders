import { Box, Text } from '@chakra-ui/react'
import { FaHeart } from 'react-icons/fa'

const ResultLogic = ({ lives, enemiesDefeated }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Box display="flex" alignItems="center">
        {Array.from({ length: lives }).map((_, index) => (
          <FaHeart key={index} color="red" />
        ))}
      </Box>
      <Box mt={2}>
        <Text fontSize="xl" color="white">
          Enemies Defeated: {enemiesDefeated}
        </Text>
      </Box>
    </Box>
  )
}

export default ResultLogic
