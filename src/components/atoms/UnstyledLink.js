import styled from 'styled-components'
import { Link } from 'gatsby'
import { COLORS } from '@/ui/theme'

export const UnstyledLink = styled(Link)`
  text-decoration: unset;
  color: ${COLORS.mainText};
  font-style: unset;
  cursor: pointer;
  display: flex;
`