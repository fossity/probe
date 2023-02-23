import React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',

    '& > main': {
      background: '#FFFFFF',
      borderRadius: 10,
      padding: 16,
      height: '100%',
      overflowY: 'scroll',
    },

    '& .title': {
      fontSize: 18,
      fontWeight: 600,
    },
    '& .label': {
      fontSize: 14,
      fontWeight: 400,
      color: theme.palette.primary.main
    },
    '& .value': {
      fontSize: 16,
      fontWeight: 400,

      '&.small': {
        fontSize: 12,
      }
    }
  }
}));

const Panel = ({ title, children }) => {
  const classes = useStyles();

  return (
    <section className={classes.root}>
      <header>
        <Typography className="title" variant="h5" gutterBottom>
          {title}
        </Typography>
      </header>
      <main>
        {children}
      </main>
    </section>
  );
};

export const Data = ({label = null, value, size="normal"}) => (
  <>
    {label &&
      <Typography className="label" variant="subtitle1">
        {label}
      </Typography>
    }
    <Typography className={`value ${size}`} variant="h6" gutterBottom>
      {value || '-'}
    </Typography>
  </>
);

export default Panel;
