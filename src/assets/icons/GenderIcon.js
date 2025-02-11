import * as React from "react"
import Svg, { Path } from "react-native-svg"

function GenderIcon(props) {
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
        d="M14.25 13.125a3.374 3.374 0 11-6.749 0 3.374 3.374 0 016.749 0zm6-9.375v16.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V3.75a1.5 1.5 0 011.5-1.5h13.5a1.5 1.5 0 011.5 1.5zm-2.25 3a.75.75 0 00-.75-.75h-3a.75.75 0 100 1.5h1.19l-1.688 1.688a4.883 4.883 0 101.06 1.064L16.5 8.564V9.75a.75.75 0 101.5 0v-3z"
        fill="#000"
      />
    </Svg>
  )
}

export default GenderIcon
