import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function FindDeviceIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M13 17a3 3 0 106 0 3 3 0 00-6 0zm11 6.59V12l-6-6h-8a2 2 0 00-2 2v16a2 2 0 002 2h12c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.76.83-2.76.83a5 5 0 115-5c0 1-.31 1.96-.83 2.75L24 23.59z"
        fill="#000"
      />
    </Svg>
  );
}

export default FindDeviceIcon;
