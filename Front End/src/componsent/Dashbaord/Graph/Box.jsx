import * as React from 'react';
import Box from '@mui/system/Box';

export default function BoxSystemProps(props) {
    const { sale , name } = props;
    
  return (
    <Box
      height={100}
      width={200}
      my={4}
      display="flex"
      
      gap={4}
      p={2}
      sx={{ border: '2px solid grey' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <h2>{name }:{sale} </h2>
      </Box>
    </Box>
  );
}