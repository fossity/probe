import React from 'react';
import { Step, StepLabel, Stepper } from '@mui/material';

const steps = [
  'Project Information',
  'Obfuscation',
  'Project Summary',
];

const FlowStepper = ({ step = 0 }) => {

  return (
    <div className='progress-stepper'>
      <Stepper activeStep={step} >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{ step === index ? label : ''}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default FlowStepper;
