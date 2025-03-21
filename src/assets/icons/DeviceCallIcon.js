import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const DeviceCallIcon = ({ size = 32, color = '#000', viewBoxSize = 32, ...props }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M25 20.42v3.536a1 1 0 01-.93.998c-.437.03-.793.046-1.07.046-8.837 0-16-7.163-16-16 0-.276.015-.633.046-1.07A1 1 0 018.044 7h3.536a.5.5 0 01.498.45c.023.23.044.413.064.552a13.9 13.9 0 001.208 4.001c.095.2.033.439-.147.567l-2.158 1.542a13.05 13.05 0 006.844 6.844l1.54-2.154a.46.46 0 01.573-.149 13.9 13.9 0 004 1.205c.139.02.322.041.55.064a.5.5 0 01.448.498z"
        fill={color}
      />
    </Svg>
  );
};

export default DeviceCallIcon;
