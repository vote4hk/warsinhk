import React from "react"
import styled from "styled-components"
import { LabelBox } from "@/components/atoms/LabelBox"
import { useTranslation } from "react-i18next"
import { bps } from "@/ui/theme"

const ResponsiveLabelBox = styled(LabelBox)`
  ${bps.up("xs")} {
    width: 320px;
    height: 50px;
  }

  ${bps.up("sm")} {
    width: 468px;
    height: 60px;
  }

  ${bps.up("md")} {
    width: 728px;
    height: 90px;
  }
`

export function LeaderBoard(props) {
  const { t } = useTranslation()

  return (
    <ResponsiveLabelBox labelText={t("ad.label")}>
      <div>LeaderBoard</div>
    </ResponsiveLabelBox>
  )
}
