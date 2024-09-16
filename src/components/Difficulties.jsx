import { Button, Stack, useToast } from '@chakra-ui/react'

const Difficulties = ({ onSelectDifficulty }) => {
  const toast = useToast()

  const handleDifficultySelect = (level) => {
    onSelectDifficulty(level)
    toast({
      title: `Difficulty selected: ${level}`,
      status: 'success',
      position: 'top-right',
      duration: 2000,
      isClosable: true
    })
  }

  return (
    <Stack direction="row" spacing={4} mb={4}>
      <Button
        size="lg"
        colorScheme="green"
        onClick={() => handleDifficultySelect('Easy')}
      >
        Easy
      </Button>
      <Button
        size="lg"
        colorScheme="yellow"
        onClick={() => handleDifficultySelect('Normal')}
      >
        Normal
      </Button>
      <Button
        size="lg"
        colorScheme="red"
        onClick={() => handleDifficultySelect('Expert')}
      >
        Expert
      </Button>
    </Stack>
  )
}

export default Difficulties
