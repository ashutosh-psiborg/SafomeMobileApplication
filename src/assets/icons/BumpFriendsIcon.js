import * as React from "react"
import Svg, { Path } from "react-native-svg"

function BumpFriendsIcon(props) {
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
        d="M12 16c1.934 0 3.5-1.566 3.5-3.5S13.934 9 12 9a3.498 3.498 0 00-3.5 3.5c0 1.934 1.566 3.5 3.5 3.5zm2.4 1h-.26c-.65.313-1.371.5-2.14.5a4.933 4.933 0 01-2.14-.5H9.6A3.6 3.6 0 006 20.6v.9A1.5 1.5 0 007.5 23h9a1.5 1.5 0 001.5-1.5v-.9a3.6 3.6 0 00-3.6-3.6zm6.6-1a3 3 0 10-.002-6.002A3 3 0 0021 16zm1.5 1h-.119a4.21 4.21 0 01-1.381.25c-.488 0-.947-.1-1.381-.25H19.5c-.637 0-1.225.184-1.74.481A4.574 4.574 0 0119 20.6v1.2c0 .069-.016.134-.019.2H24.5a1.5 1.5 0 001.5-1.5c0-1.934-1.566-3.5-3.5-3.5z"
        fill="#000"
      />
    </Svg>
  )
}

export default BumpFriendsIcon
