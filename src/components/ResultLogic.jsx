import { Box, Text } from '@chakra-ui/react'

const ResultLogic = ({ lives, enemiesDefeated }) => {
  return (
    <Box mt={4}>
      <Text fontSize="xl">Lives Left: {lives}</Text>
      <Text fontSize="xl">Enemies Defeated: {enemiesDefeated}</Text>
    </Box>
  )
}

export default ResultLogic
