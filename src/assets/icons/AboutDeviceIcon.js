import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function AboutDeviceIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M17 13h-2v-2h2m0 10h-2v-6h2m-1-9a10 10 0 100 20 10 10 0 000-20z"
        fill="#000"
      />
    </Svg>
  );
}

export default AboutDeviceIcon;
