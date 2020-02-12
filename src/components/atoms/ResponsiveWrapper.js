import styled from "styled-components"
import { bps } from "@/ui/theme"

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${bps.up("md")} {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;

    > [class*="Stepper"] {
      flex: 1 0 100%;
    }

    > [class*="Card"] {
      flex: 0 0 calc(50% - 16px);
    }
  }
  ${bps.up("lg")} {
    > [class*="Card"] {
      flex: 0 0 calc(33.3% - 16px);
      margin-left: 8px;
      margin-right: 8px;
    }
  }
`
