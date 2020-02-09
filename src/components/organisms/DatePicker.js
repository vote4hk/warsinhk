import React, { useReducer } from "react"
import { DateRangeInput } from "@datepicker-react/styled"
import styled, { ThemeProvider } from "styled-components"
import { useTranslation } from "react-i18next"
import { useMediaQuery } from "@material-ui/core"
import { bps, COLORS } from "@/ui/theme"

const DateRangeInputContainer = styled.div`
  margin-top: 10px;
`

const initialState = {
  startDate: null,
  endDate: null,
  focusedInput: null,
}

function reducer(state, action) {
  switch (action.type) {
    case "focusChange":
      return { ...state, focusedInput: action.payload }
    case "dateChange":
      const { startDate, endDate } = action.payload
      action.setSearchStartDate(startDate)
      action.setSearchEndDate(endDate)
      return action.payload
    default:
      throw new Error()
  }
}

function DatePicker(props) {
  const { setSearchStartDate, setSearchEndDate } = props
  const [state, dispatch] = useReducer(reducer, initialState)
  const { startDate, endDate, focusedInput } = state
  const { t } = useTranslation()
  const isMobile = useMediaQuery(bps.down("md"))

  const phrasesProp = {
    datepickerStartDatePlaceholder: t(
      "datepicker.datepickerStartDatePlaceholder"
    ),
    datepickerStartDateLabel: t("datepicker.datepickerStartDateLabel"),
    datepickerEndDatePlaceholder: t("datepicker.datepickerEndDatePlaceholder"),
    datepickerEndDateLabel: t("datepicker.datepickerEndDateLabel"),
    resetDates: t("datepicker.resetDates"),
    startDateAriaLabel: t("datepicker.startDateAriaLabel"),
    endDateAriaLabel: t("datepicker.endDateAriaLabel"),
    startDatePlaceholder: t("datepicker.startDatePlaceholder"),
    endDatePlaceholder: t("datepicker.endDatePlaceholder"),
    close: t("datepicker.close"),
  }

  return (
    <DateRangeInputContainer>
      <ThemeProvider
        theme={{
          reactDatepicker: {
            fontFamily: "system-ui, -apple-system",
            colors: {
              accessibility: COLORS.secondary,
              selectedDay: COLORS.main.primary,
              selectedDayHover: COLORS.secondary,
              primaryColor: COLORS.main.primary,
            },
            inputCalendarWrapperLeft: "16px",
            inputCalendarWrapperRight: "16px",
            dateRangeGridTemplateColumns: "1fr 24px 1fr",
            dateRangeStartDateInputPadding: "0 8px 0 32px",
            dateRangeEndDateInputPadding: "0 8px 0 32px",
          },
        }}
      >
        <DateRangeInput
          onDatesChange={data =>
            dispatch({
              type: "dateChange",
              payload: data,
              setSearchStartDate,
              setSearchEndDate,
            })
          }
          onFocusChange={focusedInput =>
            dispatch({ type: "focusChange", payload: focusedInput })
          }
          startDate={startDate}
          endDate={endDate}
          focusedInput={focusedInput}
          phrases={phrasesProp}
          vertical={isMobile ? true : false}
        />
      </ThemeProvider>
    </DateRangeInputContainer>
  )
}

export default DatePicker
