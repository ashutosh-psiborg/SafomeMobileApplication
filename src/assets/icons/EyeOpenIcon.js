import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function EyeOpenIcon(props) {
  return (
    <Svg
      width={20}
      height={12}
      viewBox="0 0 20 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M1 7c3.6-8 14.4-8 18 0M10 11a3 3 0 110-5.999A3 3 0 0110 11z"
        stroke="#000"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default EyeOpenIcon;
