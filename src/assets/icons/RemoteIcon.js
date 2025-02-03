import * as React from 'react';
import Svg, {G, Mask, Path, Defs, ClipPath} from 'react-native-svg';

function RemoteIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_5556_4732)">
        <Mask
          id="a"
          style={{
            maskType: 'luminance',
          }}
          maskUnits="userSpaceOnUse"
          x={4}
          y={4}
          width={24}
          height={25}>
          <Path d="M4 4h24v24H4V4z" fill="#fff" />
          <Path
            d="M10.773 11.55a.924.924 0 111.315 1.296 5.658 5.658 0 00-1.627 3.986c0 3.111 2.483 5.63 5.539 5.63 3.055 0 5.538-2.518 5.538-5.631a5.655 5.655 0 00-1.626-3.985.922.922 0 111.314-1.296 7.505 7.505 0 012.159 5.28c0 4.127-3.303 7.478-7.385 7.478-4.081 0-7.385-3.351-7.385-7.477 0-2.006.785-3.89 2.158-5.281z"
            fill="#000"
          />
          <Path
            d="M16.923 8.615a.923.923 0 00-1.846 0v7.847a.923.923 0 001.846 0V8.615z"
            fill="#000"
          />
        </Mask>
        <G mask="url(#a)">
          <Path
            d="M16 28c6.627 0 12-5.372 12-12 0-6.627-5.373-12-12-12S4 9.373 4 16c0 6.628 5.373 12 12 12z"
            fill="#000"
          />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_5556_4732">
          <Path fill="#fff" transform="translate(4 4)" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default RemoteIcon;
