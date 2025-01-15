import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SecurityTickIcon(props) {
  return (
    <Svg
      width={20}
      height={24}
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M20 3.94L10 .44 0 3.94V12c0 4.127 2.534 7.012 4.896 8.803a19.795 19.795 0 004.65 2.595c.113.043.227.083.342.122l.112.04.114-.04c.219-.076.435-.157.65-.244a19.698 19.698 0 004.34-2.473C17.467 19.012 20 16.127 20 12V3.94zM9.001 15.415L4.76 11.172l1.414-1.415 2.828 2.829 5.657-5.657 1.415 1.414-7.073 7.072z"
        fill="#005BBB"
      />
    </Svg>
  )
}

export default SecurityTickIcon
