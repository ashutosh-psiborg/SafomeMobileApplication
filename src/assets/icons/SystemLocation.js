import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SystemLocation(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M23 13a7.001 7.001 0 00-14 0c0 1.387.409 2.677 1.105 3.765h-.008L16 26l5.903-9.235h-.007A6.97 6.97 0 0023 13zm-7 3a3 3 0 110-6 3 3 0 010 6z"
        fill="#000"
      />
    </Svg>
  );
}

export default SystemLocation;
