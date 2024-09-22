import { GiArcher } from 'react-icons/gi'
import { Box } from '@chakra-ui/react'

const Archers = ({ iconSize, position }) => {
  return (
    <Box gridColumn={position + 1}>
      <GiArcher color="green" fontSize={iconSize} />
    </Box>
  )
}

export default Archers
