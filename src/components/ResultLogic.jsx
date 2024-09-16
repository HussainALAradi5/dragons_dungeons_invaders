import { Box, Text } from '@chakra-ui/react'
import { FaHeart } from 'react-icons/fa'

const ResultLogic = ({ lives, enemiesDefeated }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={4}
    >
      <Box display="flex" alignItems="center">
        <FaHeart color="red" />
        <Text ml={2} fontSize="xl" color="white">
          Lives: {lives}
        </Text>
      </Box>
      <Box>
        <Text fontSize="xl" color="white">
          Enemies Defeated: {enemiesDefeated}
        </Text>
      </Box>
    </Box>
  )
}

export default ResultLogic
