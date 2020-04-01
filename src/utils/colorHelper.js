import { pink, teal, red, grey, amber } from "@material-ui/core/colors"

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
      main: "#f99f02",
      contrastText: "#000",
    },
    pending_admission: {
      main: amber[900],
      contrastText: "#000",
    },
    discharged: {
      main: "#368e3b",
      contrastText: "#fff",
    },
    serious: {
      main: "#eb605e",
      contrastText: "#fff",
    },
    critical: {
      main: red[900],
      contrastText: "#fff",
    },
    deceased: {
      main: "#767676",
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
