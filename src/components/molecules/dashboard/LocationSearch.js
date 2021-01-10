import React from "react"
import { useTranslation } from "react-i18next"
import { WarsCaseCard } from "@components/organisms/CaseCard"
import AsyncSelect from "react-select/async"
import _debounce from "lodash.debounce"
import _sortBy from "lodash.sortBy"
import * as addressParser from "hk-address-parser-lib";
import { graphql, useStaticQuery } from "gatsby"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core"
import { withLanguage } from "@/utils/i18n"
import Paper from "@material-ui/core/Paper"
import { getDistanceFromLatLonInKm } from "@/utils"



export default function ConfirmedCaseVisual(props) {
  // TODO: split the data into a smaller subset?
  // since useStaticQuery cannot pass variable we cannot do the proper filtering to reduce the data size..
  const data = useStaticQuery(
    graphql`
      query {
        allWarsCaseLocation(
        sort: { order: DESC, fields: end_date }
        filter: { end_date: {gt: "2020-01-01"}}          
    ) {
      edges {
          node {
            id
            lng
            lat
            case_no
            start_date
            end_date
            sub_district_zh
            sub_district_en
            location_zh
            location_en
            action_zh
            action_en
          }
        }
    }
}`);

  const { i18n, t } = useTranslation()
  const [input, setInput] = React.useState('');
  const [distanceFilter, setDistanceFilter] = React.useState(1.0);

  const debouncedLoadOptions = React.useCallback(
    _debounce((inputValue, callback) => {
      addressParser
        .parse(inputValue)
        .then(results => {
          callback(results.map(r => ({
            label: i18n.language === 'en' ? r.record.nameEN : r.record.nameZH,
            value: r.record
          })));
        })
    }, 500),
    []
  );

  const records = React.useMemo(() => {
    if (!input.value) {
      return [];
    }

    const {
      lat, lng
    } = input.value;

    // TODO: stupid distance calculation here. calculating maybe 20k+ distance ..
    const filteredArray = (data.allWarsCaseLocation.edges || []).map(r => ({
      ...r,
      distance: getDistanceFromLatLonInKm(
        parseFloat(lat), parseFloat(lng),
        parseFloat(r.node.lat), parseFloat(r.node.lng)),
    }))
      .filter(({distance}) => distance < distanceFilter)
      .filter((_,i) => i < 20);

    return _sortBy(filteredArray, [({distance}) => distance]);
  }, [input])



  // since useStateQuery cannot pass variables, hence we do the filtering here
  return (
    <>
      <AsyncSelect
        loadOptions={debouncedLoadOptions}
        onChange={setInput}
      />
      <div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableBody>
              {records.map((row) => (
                <TableRow key={row.node.id}>
                  <TableCell component="th" scope="row">
                    {withLanguage(i18n, row.node, 'location')}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {`#${row.node.case_no}`}
                  </TableCell>
                  <TableCell align="right">
                    {withLanguage(i18n, row.node, 'action')}
                  </TableCell>
                  <TableCell align="right">{`${Math.round(row.distance*1000)}M`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </>
  )
}
