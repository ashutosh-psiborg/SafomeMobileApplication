import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function TimeZoneIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M19 16h1.5v4.25l2.86 1.69-.75 1.22L19 21v-5zm8 4a7 7 0 01-7 7c-3 0-5.6-1.92-6.58-4.6L12 21.9l-5.34 2.07-.16.03a.5.5 0 01-.5-.5V8.38c0-.23.15-.41.36-.48L12 6l6 2.1L23.34 6h.16a.5.5 0 01.5.5v7.75c1.81 1.25 3 3.37 3 5.75zm-14 0c0-3.17 2.11-5.85 5-6.71v-3.18L12 8v11.89l1 .35V20zm7-5a5 5 0 100 10 5 5 0 000-10z"
        fill="#000"
      />
    </Svg>
  );
}

export default TimeZoneIcon;
