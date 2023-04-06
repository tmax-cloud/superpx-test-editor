import React from 'react';
import { Avatar } from '@mui/material';
interface SmallIconProps {
  contents: string;
}
export default function SmallIcon({ contents }: SmallIconProps) {
  return (
    <>
      <Avatar
        sx={{
          bgcolor: 'primary.main',
          borderRadius: '20%',
          top: '15px',
          width: '20px',
          height: '20px',
          fontSize: '0.25rem',
        }}
      >
        {'IC'}
      </Avatar>
      <p>{contents}</p>
    </>
  );
}
