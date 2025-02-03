import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function DisableIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 5.5a10.5 10.5 0 100 21 10.5 10.5 0 000-21zm5.031 14.47l-9-9-1.062 1.061 9 9 1.062-1.06z"
        fill="#000"
      />
    </Svg>
  );
}

export default DisableIcon;
