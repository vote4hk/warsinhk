import { createMuiTheme } from "@material-ui/core/styles"
import { red, green } from "@material-ui/core/colors"
import createBreakpoints from "@material-ui/core/styles/createBreakpoints"

export const bps = createBreakpoints({})

export const headingFontFamily =
  "Noto Sans TC, 微軟正黑體, 新細明體, sans-serif"
export const bodyFontFamily = "Noto Sans TC, 微軟正黑體, 新細明體, sans-serif"

export const FONT_FAMILY = [
  "Noto Sans TC",
  "微軟正黑體",
  "新細明體",
  "sans-serif",
  "-apple-system",
  '"Helvetica Neue"',
  "Arial",
]

export const palette = {
  primary: {
    main: "#505096",
    light: "#f5f5f6",
    dark: "#000051",
    text: "#ffffff",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#ef5350",
    light: "#ff867c",
    dark: "#b61827",
    text: "#000000",
    contrastText: "#000000",
  },
  background: {
    default: "#f5f5f6",
    paper: "#fff",
  },
  trafficLight: {
    red: "#c0392b",
    orange: "#e67e22",
    green: "#27ae60",
  },
}

export const typography = fontZoom => ({
  useNextVariants: true,
  xsmallFontSize: 12 * fontZoom,
  smallFontSize: 14 * fontZoom,
  fontSize: 16 * fontZoom,
  fontFamily: FONT_FAMILY.join(","),
  h1: {
    fontFamily: headingFontFamily,
    fontSize: 20 * fontZoom,
    fontWeight: 600,
  },
  h2: {
    fontFamily: headingFontFamily,
    fontSize: 26 * fontZoom,
    fontWeight: 600,
  },
  h3: {
    fontFamily: headingFontFamily,
    fontSize: 22 * fontZoom,
    fontWeight: 600,
  },
  h4: {
    fontFamily: FONT_FAMILY,
    fontSize: 18 * fontZoom,
    fontWeight: 600,
  },
  h5: {
    fontFamily: headingFontFamily,
    fontSize: 16 * fontZoom,
    fontWeight: 500,
  },
  h6: {
    fontFamily: headingFontFamily,
    fontSize: 16 * fontZoom,
    fontWeight: 600,
    lineHeight: 1.3,
  },
  body1: {
    fontFamily: bodyFontFamily,
    fontSize: 16 * fontZoom,
    lineHeight: 1.4,
  },
  body2: {
    fontFamily: bodyFontFamily,
    fontSize: 14 * fontZoom,
  },
})

export const COLORS = {
  main: {
    text: "#fff",
    primary: "#1a237e",
    secondary: "#62adf0",
    background: "#f5f5f6",
  },
  mainText: "black",
  dark: {
    backgroundColor: "#3e474f",
    color: "white",
  },
  camp: {
    democracy: {
      background: "#ffcd00",
      text: "black",
    },
    establishment: {
      background: "#45b6ff",
      text: "black",
    },
    localist: {
      background: "#ffcd00",
      text: "black",
    },
    other: {
      background: "#a8a8ad",
      text: "black",
    },
    uncertain: {
      background: "#a8a8ad",
      text: "black",
    },
  },
  common: {
    success: green[800],
    failure: red[800],
  },
  secondaryBackgroundColor: "#f2f2f3", // grey
}

export const createThemeWithFontZoom = fontZoom =>
  createMuiTheme({
    typography: typography(fontZoom),
    palette,
  })

export default createMuiTheme({
  typography: typography(1),
  palette,
})
