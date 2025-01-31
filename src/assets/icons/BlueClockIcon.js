import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function BlueClockIcon(props) {
  return (
    <Svg
      width={20}
      height={21}
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M10 .5c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10S4.477.5 10 .5zm0 4a1 1 0 00-1 1v5a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 10.086V5.5a1 1 0 00-1-1z"
        fill="#0279E1"
      />
    </Svg>
  );
}

export default BlueClockIcon;
