import * as React from "react"
import Svg, { Path } from "react-native-svg"

function RateAppIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M16 20.3l-3.7 2.825a.874.874 0 01-.6.213 1.043 1.043 0 01-.575-.188 1.155 1.155 0 01-.387-.475.838.838 0 01-.013-.65L12.15 17.4l-3.625-2.575a.845.845 0 01-.375-.525 1.04 1.04 0 01.025-.6 1.16 1.16 0 01.35-.488.89.89 0 01.6-.212H13.6l1.45-4.8c.084-.233.213-.412.388-.538A.943.943 0 0116 7.475c.2.001.387.064.563.188.176.125.305.304.387.537L18.4 13h4.475c.234 0 .434.071.6.213.167.142.284.305.35.487.067.183.075.383.025.6a.842.842 0 01-.375.525L19.85 17.4l1.425 4.625c.084.234.08.45-.012.65-.091.2-.22.359-.388.475-.167.117-.359.18-.575.188a.87.87 0 01-.6-.213L16 20.3z"
        fill="#000"
      />
    </Svg>
  )
}

export default RateAppIcon
