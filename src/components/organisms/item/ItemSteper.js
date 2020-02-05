import React from "react"
import MobileStepper from "@material-ui/core/MobileStepper"
import Button from "@material-ui/core/Button"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"

export const ItemStepper = props => {
  const { maxSteps, activeStep, onNextClick, onBackClick } = props
  return (
    <MobileStepper
      steps={maxSteps}
      position="static"
      variant="text"
      activeStep={activeStep}
      nextButton={
        <Button
          size="small"
          onClick={onNextClick}
          disabled={activeStep === maxSteps - 1}
        >
          <KeyboardArrowRight />
        </Button>
      }
      backButton={
        <Button size="small" onClick={onBackClick} disabled={activeStep === 0}>
          <KeyboardArrowLeft />
        </Button>
      }
    />
  )
}
