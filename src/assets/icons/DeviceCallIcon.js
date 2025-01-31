import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function DeviceCallIcon(props) {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M18 13.42v3.536a1 1 0 01-.93.998c-.437.03-.793.046-1.07.046C7.163 18 0 10.837 0 2c0-.276.015-.633.046-1.07A1 1 0 011.044 0H4.58a.5.5 0 01.498.45c.023.23.044.413.064.552A13.9 13.9 0 006.35 5.003c.095.2.033.439-.147.567L4.045 7.112a13.05 13.05 0 006.844 6.844l1.54-2.154a.46.46 0 01.573-.149 13.9 13.9 0 004 1.205c.139.02.322.041.55.064a.5.5 0 01.448.498z"
        fill="#000"
      />
    </Svg>
  );
}

export default DeviceCallIcon;
