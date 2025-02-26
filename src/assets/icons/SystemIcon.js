import * as React from 'react';
import Svg, {Mask, Path, G} from 'react-native-svg';

function SystemIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Mask
        id="a"
        style={{
          maskType: "luminance"
        }}
        maskUnits="userSpaceOnUse"
        x={5}
        y={6}
        width={22}
        height={21}
      >
        <Path
          d="M16 10l7 4v8l-7 4-7-4v-8l7-4z"
          fill="#fff"
          stroke="#fff"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d="M16 7v3"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M9 14l7 4 7-4"
          stroke="#000"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M23 22l3 1.5m-20 0L9 22"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16 18v8"
          stroke="#000"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M19.5 12l3.5 2v4m-10.5-6L9 14v4m3.5 6l3.5 2 3.5-2"
          stroke="#fff"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </Mask>
      <G mask="url(#a)">
        <Path d="M4 4h24v24H4V4z" fill="#000" />
      </G>
    </Svg>
  )
}

export default SystemIcon;
