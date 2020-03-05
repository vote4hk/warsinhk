import { pink, teal, red, green, grey, indigo } from "@material-ui/core/colors"

export const mapColorForClassification = classification => {
  const mapping = {
    imported: {
      main: pink[600],
      contrastText: "#fff",
    },
    imported_close_contact: {
      main: pink[700],
      contrastText: "#fff",
    },
    local: {
      main: teal[600],
      contrastText: "#fff",
    },
    local_possibly: {
      main: teal[500],
      contrastText: "#fff",
    },
    local_unknown_source: {
      main: teal[700],
      contrastText: "#fff",
    },
    local_possibly_close_contact: {
      main: teal[400],
      contrastText: "#fff",
    },
    local_close_contact: {
      main: teal[500],
      contrastText: "#fff",
    },
    default: {
      main: grey[900],
      contrastText: "#fff",
    },
  }

  if (!mapping[classification]) return mapping["default"]
  return mapping[classification]
}

export const mapColorForStatus = status => {
  const mapping = {
    hospitalised: {
      main: indigo[900],
      contrastText: "#000",
    },
    discharged: {
      main: green[700],
      contrastText: "#fff",
    },
    serious: {
      main: red[600],
      contrastText: "#fff",
    },
    critical: {
      main: red[900],
      contrastText: "#fff",
    },
    deceased: {
      main: red["A700"],
      contrastText: "#fff",
    },
    default: {
      main: grey[50],
      contrastText: "#000",
    },
  }

  if (!mapping[status]) return mapping["default"]
  return mapping[status]
}
