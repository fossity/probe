import React, { useEffect, useState } from 'react';
import { Paper, IconButton, InputBase, InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/TextInput';

const useStyles = makeStyles((theme) => ({
  input: {
    padding: '12px 12px !important'
  },
}));

export interface SearchBoxProps {
  value?: string;
  placeholder?: string;
  responseDelay?: number;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const SearchBox = ({ value, placeholder, responseDelay, disabled, onChange }: SearchBoxProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const timeOutId = setTimeout(() => onChange(query), responseDelay);
    return () => clearTimeout(timeOutId);
  }, [query]);

  useEffect(() => {
    if (value !== query) setQuery(value);
  }, [value]);

  return (
      <TextInput
        multiline
        minRows={1}
        maxRows={1}
        disabled={disabled}
        value={query}
        onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
        onChange={(e: any) => setQuery(e.target.value)}
        placeholder={placeholder || t('Search')}
        InputProps={{
          className: classes.input,
          'aria-label': placeholder,
          spellCheck: 'false',
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setQuery('')}
                edge="end"
                size="small"
              >
                { query && <CloseIcon fontSize="inherit" /> }
              </IconButton>
            </InputAdornment>
          ),
      }}
      />
  );
};

SearchBox.defaultProps = { value: '', placeholder: null, responseDelay: 300, disabled: false };

export default SearchBox;
