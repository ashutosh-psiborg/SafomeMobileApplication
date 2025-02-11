import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ProfileEditIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M15 16l-4 4h10v-4h-6zm-2.94-8.81L3 16.25V20h3.75l9.06-9.06-3.75-3.75zm6.65.85c.39-.39.39-1.04 0-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        fill="#000"
      />
    </Svg>
  )
}

export default ProfileEditIcon
