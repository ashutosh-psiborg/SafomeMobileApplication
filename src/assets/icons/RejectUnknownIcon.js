import * as React from "react"
import Svg, { Path } from "react-native-svg"

function RejectUnknownIcon(props) {
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
        d="M15.5 6a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM22 18c-.93 0-1.5.656-1.5 1.25v1h-2v-1c0-1.892 1.67-3.25 3.5-3.25s3.5 1.358 3.5 3.25a3.13 3.13 0 01-1.027 2.3L23 22.94v.682h-2v-1.546l2.112-1.993c.256-.235.388-.53.388-.834 0-.593-.57-1.249-1.5-1.249zm-1 6.996h2.003V27h-2.004L21 24.996zM16.876 18a6.47 6.47 0 00-1.376 4c0 1.51.514 2.897 1.376 4H6v-2a6 6 0 016-6h4.876z"
        fill="#000"
      />
    </Svg>
  )
}

export default RejectUnknownIcon
