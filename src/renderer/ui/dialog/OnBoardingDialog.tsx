import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, IconButton } from '@mui/material';
import { DialogResponse, DIALOG_ACTIONS } from '@context/types';
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from 'react-i18next';

import c01 from '@assets/imgs/carousel/c01.png';
import c02 from '@assets/imgs/carousel/c02.png';
import c03 from '@assets/imgs/carousel/c03.png';
import c04 from '@assets/imgs/carousel/c04.png';
import c05 from '@assets/imgs/carousel/c05.png';
import c06 from '@assets/imgs/carousel/c06.png';
import c07 from '@assets/imgs/carousel/c07.png';
import c08 from '@assets/imgs/carousel/c08.png';
import c09 from '@assets/imgs/carousel/c09.png';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  size: {
    '& .MuiDialog-paperWidthMd': {
      width: '600px',
    },
  },

  carousel: {
    display: 'grid',
    height: 500,
    gridTemplateRows: 'auto 1fr',

    '& > header': {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexFlow: 'column',

      '& p': {
        textAlign: 'center'
      },

      '& .title': {
        margin: 0,
        marginBottom: 8,
        fontSize: 34,
        fontWeight: 600,
      },
      '& .subtitle': {
        width: '80%',
        margin: '0 auto',
        fontSize: 17,
      }
    },

    '& .slides': {
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

      '& > .slide': {
        maxWidth: '100%'
      }
    },
  },

  actions: {
    display: 'flex',
    justifyContent: 'space-between',

    '& .dots': {
      width: 8,
      height: 8,
      backgroundColor: '#AFB1B6',
      borderRadius: '100%',
      display: 'inline-block',
      margin: '8px 2px',

      '&.active': {
        backgroundColor: theme.palette.primary.main,
      }
    },
  }
}));

const SLIDES = [
  {
    title: 'Welcome to Fossity Probe!',
    subtitle: 'Fossity is a specially designed Open Source Auditing Platform with a totally decentralized auditing network. Fossity makes auditing confidential by definition',
    img: c01
  },
  {
    title: 'Audit Your Projects easier',
    subtitle: 'Collect software samples with one click and start the process',
    img: c02
  },
  {
    title: 'Complete the basic information',
    subtitle: 'Load the basic information so we can reach you and know more about your audit project',
    img: c03
  },
  {
    title: 'Obfuscate strings',
    subtitle: 'Ban the words sensibles to your project',
    img: c04
  },
  {
    title: 'Analyze your audit project',
    subtitle: 'Create the fingerprints to audit after',
    img: c05,
  },
  {
    title: 'Review the new code',
    subtitle: 'Check the samples generated, everything must be right when you export.',
    img: c06,
  },
  {
    title: 'Download the file .fossity',
    subtitle: 'Get the file with all your audit project information',
    img: c07,
  },
  {
    title: 'Upload the file in fossity.com',
    subtitle: 'Go to fossity.com and upload your file. We will reach you to start the Audit!',
    img: c08,
  },
  {
    title: 'Start auditing easier!',
    subtitle: 'Now you have it, go and audit your projects in a new simpler way',
    img: c09,
  },

];

interface OnBoardingDialogProps {
  open: boolean;
  onClose: (response: DialogResponse) => void;
  onCancel: () => void;
}

const OnBoardingDialog = ({ open, onClose, onCancel }: OnBoardingDialogProps) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [index, setIndex] = useState<number>(0)

  const next = () => {
    setIndex(index + 1);
  }

  const previous = () => {
    setIndex(index - 1);
  }

  const handleClose = (e, reason) => {
    if (reason !== 'backdropClick') {
      onClose(e);
    }
  }

  const preload = () => {
    const imgs: Promise<any>[] = SLIDES.map(slide => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = function() {
          resolve(img)
        }
        img.onerror = function() {
          reject(slide.img)
        }
        img.src = slide.img
      });
    });

    Promise.all(imgs)
      .then(items => console.log('Carousel imgs loaded succesfully'))
      .catch(error => console.log(error));
  };

  useEffect(() => {
    preload();
  }, []);

  return (
    <>
      <Dialog
        id="OnBoardingDialog"
        className="dialog"
        maxWidth="sm"
        scroll="body"
        fullWidth
        open={open}
        onClose={handleClose}
      >
        <header className="dialog-title">
          <span>{t('Title:GettingStarted')}</span>
          <IconButton aria-label="close" tabIndex={-1} onClick={onCancel} size="large">
            <CloseIcon />
          </IconButton>
        </header>

        <div className="dialog-content">
            <div className={classes.carousel}>
              <header>
                <p className="title">{SLIDES[index].title}</p>
                <p className="subtitle">{SLIDES[index].subtitle}</p>
              </header>

              <div id="slide-container">
                  <div className="slides">
                    <img alt={SLIDES[index].title} className="slide" src={SLIDES[index].img}  />
                  </div>
              </div>
            </div>
          </div>

        <DialogActions className={classes.actions}>
            <Button
              onClick={previous}
              disabled={index === 0}
              color="inherit" >
              {t('Button:Back')}
            </Button>

            <div id="dotsContainer">
              { SLIDES.map( (slide, key) => (
                <span
                  className={ `dots ${ key === index ? 'active' : ''}`}
                />
              ))}
            </div>

            <Button
              disabled={(index + 1) === SLIDES.length}
              onClick={next} type="button" variant="contained" color="secondary">
              {t('Button:Next')}
            </Button>
          </DialogActions>
      </Dialog>
    </>
  );
};

export default OnBoardingDialog;
