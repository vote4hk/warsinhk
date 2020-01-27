import { createMuiTheme } from "@material-ui/core/styles"
import { red, green } from "@material-ui/core/colors"
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

export const typography = {
  useNextVariants: true,
  fontSize: 16,
  fontFamily: FONT_FAMILY.join(","),
  h1: {
    fontFamily: headingFontFamily,
    fontSize: 28,
    fontWeight: 500,
  },
  h2: {
    fontFamily: headingFontFamily,
    fontSize: 24,
    fontWeight: 500,
  },
  h3: {
    fontFamily: headingFontFamily,
    fontSize: 22,
    fontWeight: 500,
  },
  h4: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: 600,
  },
  h5: {
    fontFamily: headingFontFamily,
    fontSize: 16,
    fontWeight: 500,
  },
  h6: {
    fontFamily: headingFontFamily,
    fontSize: 16,
    fontWeight: 600,
  },
  body1: {
    fontFamily: bodyFontFamily,
    fontSize: 16,
    lineHeight: 1.4,
  },
  body2: {
    fontFamily: bodyFontFamily,
    fontSize: 14,
  },
}

export const COLORS = {
  main: {
    text: "#fff",
    primary: "#1a237e",
    secondary: "#ef5350", // 2019-10-19 Hackathon - secondary color to voter bar chart
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

export default createMuiTheme({
  typography,
  palette: {
    primary: {
      main: "#1a237e",
      light: "$534bae",
      dark: "#000051",
      text: "#ffffff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ef5350",
      light: "$ff867c",
      dark: "#b61827",
      text: "#000000",
      contrastText: "#000000",
    },
    background: {
      default: "#f5f5f6",
      paper: "#fff",
    },
  },
})
