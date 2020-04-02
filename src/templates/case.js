import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { WarsCaseCard } from "@components/organisms/CaseCard"
import { useTranslation } from "react-i18next"
import { withLanguage } from "@/utils/i18n"

export default ({ pageContext }) => {
  const { node, uri, patientGroup } = pageContext
  const { t, i18n } = useTranslation()

  return (
    <Layout hideAlerts={true}>
      <SEO
        uri={uri}
        titleOveride={t("case.title")}
        // TODO: duplicated entries, filter out in SEO later?
        meta={[
          {
            property: `og:title`,
            content: `${t("index.title")} | ${t("case.case_no", {
              case_no: node.case_no,
            })}`,
          },
          {
            property: `og:description`,
            content: withLanguage(i18n, node, "detail"),
          },
        ]}
      />
      <WarsCaseCard
        node={node}
        i18n={i18n}
        t={t}
        key={node.case_no}
        // isSelected={selectedCase === item.node.case_no}
        // ref={selectedCase === item.node.case_no ? selectedCard : null}
        patientTrack={patientGroup}
        backToCase={true}
      />
    </Layout>
  )
}
