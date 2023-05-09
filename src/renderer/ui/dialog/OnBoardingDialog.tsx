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
        textAlign: 'center',
      },

      '& .title': {
        margin: 0,
        marginBottom: 8,
        fontSize: 32,
        fontWeight: 600,
      },
      '& .subtitle': {
        margin: '0 auto',
        fontSize: 16,
        width: '90%',
      }
    },

    '& .slides': {
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

      '& > .slide': {
        maxWidth: '90%',
        maxHeight: '90%',
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
    title: 'Congratulations and thank you for downloading the Fossity Probe!',
    subtitle: 'The Fossity Probe is designed to be simple and straightforward to use. Just answer a few basic questions and let the tool extract fingerprints from your code, and Open Source dependencies. Fossity is inherently confidential, as it operates on a Zero Trust principle that does not require the transfer of any sensitive information from the audited code or company',
    img: c01
  },
  {
    title: 'Open Source Auditing has never been easier',
    subtitle: 'Collect your code fingerprints with one click and start the process',
    img: c02
  },
  {
    title: 'Answer a few basic questions',
    subtitle: 'Your answers provide context for our auditors and should not contain any sensitive information',
    img: c03
  },
  {
    title: 'File path obfuscation',
    subtitle: 'To protect sensitive information, select keywords in file paths to obfuscate',
    img: c04
  },
  {
    title: 'Fingerprint collection',
    subtitle: 'Let the Fossity Probe recursively analyse your code base and extract source fingerprints',
    img: c05,
  },
  {
    title: 'Check the information collected ',
    subtitle: 'All information collected by the Probe will be accessible for your review',
    img: c06,
  },
  {
    title: 'Download the .fossity file',
    subtitle: 'After you have reviewed the generated files, the Probe will compress and encrypt all information into a single .fossity file, which can be submitted to Fossity to initiate the audit',
    img: c07,
  },
  {
    title: 'Upload your .fossity file',
    subtitle: 'Securely transfer your file by dropping it in the Fossity website. You will receive a quotation automatically',
    img: c08,
  },
  {
    title: 'Great job, you\'re all set!',
    subtitle: 'Get started on your software audit immediately by accepting our competitive quote – no further input necessary. \n' +
      'If you choose to decline the offer or take no action within 48 hours, we automatically delete all information, leaving no trace of the quotation ever being generated.',
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

  const close = (e) => {
    onClose(e);
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

          { (index + 1) >= SLIDES.length  ?
            <Button
              onClick={close} type="button" variant="contained" color="secondary">
              {t('Button:Finish')}
            </Button> :
            <Button
              hidden={(index + 1) === SLIDES.length}
              disabled={(index + 1) === SLIDES.length}
              onClick={next} type="button" variant="contained" color="secondary">
              {t('Button:Next')}
            </Button>
          }
          </DialogActions>
      </Dialog>
    </>
  );
};

export default OnBoardingDialog;
