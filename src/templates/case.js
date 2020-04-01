import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { WarsCaseCard } from "@components/organisms/CaseCard"
import { useTranslation } from "react-i18next"

export default ({ pageContext }) => {
  const { node, uri, patient_track } = pageContext
  const { t, i18n } = useTranslation()

  return (
    <Layout hideAlerts={true}>
      <SEO title="WarsTip" uri={uri} />
      <WarsCaseCard
        node={node}
        i18n={i18n}
        t={t}
        key={node.case_no}
        // isSelected={selectedCase === item.node.case_no}
        // ref={selectedCase === item.node.case_no ? selectedCard : null}
        patientTrack={patient_track.group.filter(
          t => t.fieldValue === node.case_no
        )}
        backToCase={true}
      />
    </Layout>
  )
}
