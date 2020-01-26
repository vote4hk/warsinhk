import styled from 'styled-components'
import { Link } from 'gatsby'
import { COLORS } from '@/ui/theme'

export const UnstyledLink = styled(Link)`
  text-decoration: unset;
  color: ${COLORS.main.text};
  font-style: unset;
  cursor: pointer;
`