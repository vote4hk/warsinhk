import { createMuiTheme } from '@material-ui/core/styles'
import { red, green } from '@material-ui/core/colors'
export const headingFontFamily =
  'Noto Sans TC, 微軟正黑體, 新細明體, sans-serif'
export const bodyFontFamily = 'Noto Sans TC, 微軟正黑體, 新細明體, sans-serif'

export const FONT_FAMILY = [
  'Noto Sans TC',
  '微軟正黑體',
  '新細明體',
  'sans-serif',
  '-apple-system',
  '"Helvetica Neue"',
  'Arial',
]

export const typography = {
  useNextVariants: true,
  fontSize: 16,
  fontFamily: FONT_FAMILY.join(','),
  h1: {
    fontFamily: headingFontFamily,
    fontSize: 20,
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
    fontWeight: 500,
  },
  h5: {
    fontFamily: headingFontFamily,
    fontSize: 16,
    fontWeight: 500,
  },
  h6: {
    fontFamily: headingFontFamily,
    fontSize: 14,
    fontWeight: 500,
  },
  body1: {
    fontFamily: bodyFontFamily,
    fontSize: 14,
    lineHeight: 1.4,
  },
  body2: {
    fontFamily: bodyFontFamily,
    fontSize: 12,
  },
}

export const COLORS = {
  main: {
    text: '#000',
    primary: '#7B68EE', // mediumslateblue
    secondary: '#CCC4F8', // 2019-10-19 Hackathon - secondary color to voter bar chart
    background: '#fff',
  },
  mainText: 'black',
  dark: {
    backgroundColor: '#3e474f',
    color: 'white',
  },
  camp: {
    democracy: {
      background: '#ffcd00',
      text: 'black',
    },
    establishment: {
      background: '#45b6ff',
      text: 'black',
    },
    localist: {
      background: '#ffcd00',
      text: 'black',
    },
    other: {
      background: '#a8a8ad',
      text: 'black',
    },
    uncertain: {
      background: '#a8a8ad',
      text: 'black',
    },
  },
  common: {
    success: green[800],
    failure: red[800],
  },
  secondaryBackgroundColor: '#f2f2f3', // grey
}

export default createMuiTheme({
  typography,
  palette: {
    primary: {
      main: COLORS.main.primary,
      contrastText: COLORS.main.text,
    },
    secondary: {
      main: '#3e474f',
      contrastText: '#fff',
    },
  },
})
