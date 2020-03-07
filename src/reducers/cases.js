export const CASES_BOX_VIEW = "cases_box_view"
export const CASES_CARD_VIEW = "cases_card_view"

export default (state, action) => {
  switch (action.type) {
    case CASES_CARD_VIEW:
      return { view: CASES_CARD_VIEW }
    case CASES_BOX_VIEW:
    default:
      return { view: CASES_BOX_VIEW }
  }
}
