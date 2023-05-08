import React from 'react';
import { Button, LinearProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PauseIcon from '@mui/icons-material/Pause';
import { ScannerStage } from '@api/types';
import { useTranslation } from 'react-i18next';

interface ProgressBarProps {
  stage: {
    stageName?: ScannerStage;
    stageLabel: string;
    stageStep?: number;
  };
  progress: number;
  showPause?: boolean;
  pauseScan: () => void;
}

const textColor = '#71717A';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .progress-bar-number': {
      fontSize: '1em',
      color: theme.palette.primary.main,
      fontWeight: 'bold',
      width: 50,
    }
  },
  scanInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  stage: {
    color: textColor,
    fontSize: '1em',
  },
  pause: {
    color: textColor,
    zIndex: 5,
  },
  pauseContainer: {
    marginTop: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageStep: {
    fontWeight: 600,
    fontSize: '0.75em',
  },
}));

function ProgressBar({
  stage = null,
  progress,
  showPause,
  pauseScan = null,
}: ProgressBarProps) {
  const classes = useStyles();
  const { t } = useTranslation();

  const variant =
    stage.stageName === ScannerStage.UNZIP ||
    stage.stageName === ScannerStage.INDEX
      ? 'indeterminate'
      : 'determinate';

  const resumeEnable =
    stage.stageName === ScannerStage.SCAN ||
    stage.stageName === ScannerStage.RESUME ||
    stage.stageName === ScannerStage.RESCAN

  let totalProgress = 0;

  switch (stage.stageName) {
    case ScannerStage.INDEX:
      totalProgress = progress;
      break;
    case ScannerStage.SCAN:
      totalProgress = progress * 80 / 100;
      break;
    case ScannerStage.DEPENDENCY:
      totalProgress = 85;
      break;
    case ScannerStage.HINT:
      totalProgress = 90;
      break;
    case ScannerStage.OBFUSCATE:
      totalProgress = 95;
      break;
    case ScannerStage.ATTACH_FILES:
      totalProgress = 100;
      break;
    default:
      totalProgress = 0;
  }

  return (
    <div className={classes.root}>
        <div className="progress-bar-container d-flex align-center mb-2">
          <LinearProgress
            color="primary"
            variant={variant}
            value={totalProgress}
            sx={{width: 500, height: 20, borderRadius: 5,}}
          />
          <div className='progress-bar-number ml-2'>
              <span>
              { Math.round(totalProgress) + (variant === 'determinate' ? '%' : '')}
            </span>
          </div>
        </div>

        <div className={classes.scanInfoContainer}>
          <div>
            <div className={`${classes.stage}`}>{stage.stageLabel}</div>
            {/* stage.stageStep && <span className={`${classes.stageStep} text-uppercase`}>{t('Title:Stage')} {stage.stageStep}</span> */}
          </div>
          <div className={classes.pauseContainer}>
          { showPause &&
            <Button
                disabled={!resumeEnable}
                startIcon={<PauseIcon />}
                onClick={pauseScan}
              >
                <span className={classes.pause}>{t('Button:PAUSE')}</span>
            </Button>
          }
          </div>
        </div>
      </div>
  );
}

ProgressBar.defaultProps = {
  showPause: true,
};

export default ProgressBar;
