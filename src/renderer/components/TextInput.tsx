import React from 'react';
import { alpha, OutlinedInputProps, styled, TextField, TextFieldProps } from '@mui/material';

const TextInput = styled((props: TextFieldProps) => (
  <TextField
    variant="filled"
    fullWidth
    spellCheck={false}
    {...props}
    InputProps={{ className: !props.label && 'no-label', disableUnderline: true, ...props.InputProps } as Partial<OutlinedInputProps>}
  />
))(({ theme }) => ({
  '& .MuiFilledInput-root': {
    border: '1px solid transparent',
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: '#F6F6F6',
    },
    '&.Mui-focused': {
      backgroundColor: '#F6F6F6',
      borderColor: theme.palette.primary.main,
    },

    '&.MuiInputBase-multiline': {
      padding: '8px 12px',
    },
    '&.no-label .MuiInputBase-input': {
      padding: '14px 12px',
    },
  },

  '& .MuiFormLabel-root': {
    marginLeft: 32,
    color: '#AFB1B6',
    fontSize: 16,
    fontWeight: 400,
},
  '& .MuiInputAdornment-root.MuiInputAdornment-positionStart' : {
    marginTop: '0 !important',
  }
}));

export default TextInput;
