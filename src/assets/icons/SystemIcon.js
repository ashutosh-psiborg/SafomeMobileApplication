import * as React from 'react';
import Svg, {Mask, Path, G} from 'react-native-svg';

function SystemIcon(props) {
  return (
    <Svg
      width={22}
      height={21}
      viewBox="0 0 22 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Mask
        id="a"
        style={{
          maskType: 'luminance',
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={22}
        height={21}>
        <Path
          d="M11 4l7 4v8l-7 4-7-4V8l7-4z"
          fill="#fff"
          stroke="#fff"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d="M11 1v3"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M4 8l7 4 7-4"
          stroke="#000"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M18 16l3 1.5m-20 0L4 16"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M11 12v8"
          stroke="#000"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M14.5 6L18 8v4M7.5 6L4 8v4m3.5 6l3.5 2 3.5-2"
          stroke="#fff"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </Mask>
      <G mask="url(#a)">
        <Path d="M-1-2h24v24H-1V-2z" fill="#000" />
      </G>
    </Svg>
  );
}

export default SystemIcon;
