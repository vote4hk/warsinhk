import React from "react"
import MaleIcon from "./case-avatar/2x/male@2x.png"
import FemaleIcon from "./case-avatar/2x/female@2x.png"
const MaleSvgIcon = () => <image href={MaleIcon} width="48" height="48"/>
const FemaleSvgIcon = () => <image href={FemaleIcon}  width="48" height="48"/>

const ImportedMark = () => (
  <g>
    <circle fill="#505096" cx="40" cy="8.1" r="8.1" />
    <path
      fill="#FFFFFF"
      d="M40,9.7l-0.8-0.8h4.2c0.5,0,0.9-0.4,0.9-0.9c0-0.5-0.4-0.9-0.9-0.9h-4.2L40,6.4
c0.3-0.3,0.3-0.9,0-1.2s-0.9-0.3-1.3,0l-2.4,2.3c-0.2,0.2-0.3,0.4-0.3,0.6c0,0.2,0.1,0.5,0.3,0.6l2.4,2.3c0.3,0.3,0.9,0.3,1.3,0
C40.3,10.6,40.3,10.1,40,9.7z"
    />
  </g>
)
const UnknownMark = () => (
  <g>
    <circle fill="#B71C1C" cx="40" cy="8.1" r="8.1" />
    <path
      fill="#FFFFFF"
      d="M40.5,9.4c-0.2-1.5,2.2-1.7,2.2-3.3c0-1.5-1.2-2.2-2.8-2.2c-1.2,0-2.2,0.5-2.9,1.3
L38,6c0.5-0.6,1.1-0.9,1.8-0.9c0.9,0,1.4,0.4,1.4,1c0,1.1-2.3,1.5-2.1,3.2H40.5z M39.8,12.3c0.7,0,1.1-0.5,1.1-1.1
s-0.5-1.1-1.1-1.1c-0.7,0-1.1,0.4-1.1,1.1S39.1,12.3,39.8,12.3z"
    />
  </g>
)
export const CaseAvatar = ({
  color = "#A2A2A2",
  sex = "M",
  code,
  isImported,
  isUnknown,
  ...props
}) => {
  const Icon = sex === "F" ? FemaleSvgIcon : MaleSvgIcon
  return (
    <svg
      class="male"
      width="48px"
      height="60px"
      viewBox="0 0 48 60"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle className="background" fill={color} cx="24" cy="23" r="23" />
      <Icon />
      {isImported && <ImportedMark />}
      {isUnknown && <UnknownMark />}
      <text
        x={24}
        y={56}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="11"
        fill="#000"
      >
        {code}
      </text>
    </svg>
  )
}
