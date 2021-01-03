import { graphql, useStaticQuery } from "gatsby"
export const useAllCasesData = () =>
  useStaticQuery(graphql`
    query {
      allWarsCase {
        edges {
          node {
            case_no
            onset_date
            confirmation_date
            gender
            age
            hospital_zh
            hospital_en
            status
            status_zh
            status_en
            type_zh
            type_en
            citizenship_zh
            citizenship_en
            citizenship_district_zh
            citizenship_district_en
            detail_zh
            detail_en
            classification
            classification_zh
            classification_en
            source_url_1
            source_url_2
            source_url_3
            source_url_4
            source_url_5
          }
        }
      }
      allWarsCaseRelation {
        edges {
          node {
            case_no
            name_zh
            name_en
            description_zh
            description_en
          }
        }
      }
      patient_track: allWarsCaseLocation(
        sort: { order: DESC, fields: end_date }
      ) {
        group(field: case___case_no) {
          fieldValue
          edges {
            node {
              id
              action_en
              action_zh
              case_no
              end_date
              lat
              lng
              location_en
              location_zh
              remarks_en
              remarks_zh
              source_url_1
              source_url_2
              start_date
              sub_district_en
              sub_district_zh
              type
            }
          }
        }
      }
    }
  `)
