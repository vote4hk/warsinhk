import styled from "styled-components"
import { Link } from "gatsby"

export const UnstyledLink = styled(Link)`
  text-decoration: unset;
  color: ${props => props.theme.palette.secondary.text};
  font-style: unset;
  cursor: pointer;
  display: flex;
`

export const UnstyledCardLink = styled.a`
  && {
    text-decoration: unset;
    color: black;
    font-style: unset;
    cursor: pointer;

    &:hover {
      text-decoration: unset;
      font-style: unset;
    }
  }
`
