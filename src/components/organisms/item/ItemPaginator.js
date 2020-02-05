import React from "react"
import { ItemStepper } from "@components/organisms/item/ItemSteper"

const paginate = (data, pageSize, activeStep) => {
  return data.slice(activeStep * pageSize, (activeStep + 1) * pageSize)
}

export const ItemPaginator = props => {
  const { items, pageSize, activeStep, setActiveStep, children } = props

  const handleNextClick = () => {
    const maxSteps = Math.ceil(items.length / pageSize)
    setActiveStep(prevActiveStep =>
      prevActiveStep + 1 >= maxSteps ? 0 : prevActiveStep + 1
    )
  }

  const handleBackClick = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const maxSteps = Math.ceil(items.length / pageSize) || 1

  return (
    <>
      <ItemStepper
        maxSteps={maxSteps}
        activeStep={activeStep}
        onNextClick={handleNextClick}
        onBackClick={handleBackClick}
      />
      {paginate(items, pageSize, activeStep).map((item, index) =>
        children(item, index)
      )}
      <ItemStepper
        maxSteps={maxSteps}
        activeStep={activeStep}
        onNextClick={handleNextClick}
        onBackClick={handleBackClick}
      />
    </>
  )
}
