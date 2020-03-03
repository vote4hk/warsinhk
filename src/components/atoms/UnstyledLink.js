import styled from "styled-components"
import { Link } from "gatsby"

export const UnstyledLink = styled(Link)`
  text-decoration: unset;
  color: ${props => props.theme.palette.secondary.text};
  font-style: unset;
  cursor: pointer;
  display: flex;
  background: rgba(0, 0, 0, 0);
  border-radius: 4pt;
  &:hover {
    background: #f4f4f4;
  }
  &.active {
    background: rgba(80, 80, 150);
    color: white;
  }
`
