export const CASES_BOX_VIEW = "cases_box_view"
export const CASES_CARD_VIEW = "cases_card_view"
export const CHANGE_TOGGLE_GROUP = "change_toggle_group"

export default (state, action) => {
  switch (action.type) {
    case CHANGE_TOGGLE_GROUP:
      return { ...state, group: action.group }
    case CASES_CARD_VIEW:
      return { ...state, view: CASES_CARD_VIEW }
    case CASES_BOX_VIEW:
    default:
      return { ...state, view: CASES_BOX_VIEW }
  }
}
