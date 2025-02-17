import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function SyncEventIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_5528_7856)" fill="#000">
        <Path d="M6.667 6.667A.667.667 0 007.333 6V2A.667.667 0 106 2v4a.667.667 0 00.667.667zM17.334 6.667A.667.667 0 0018 6V2a.667.667 0 10-1.333 0v4a.666.666 0 00.667.667z" />
        <Path d="M21.5 4h-2.667v2A1.466 1.466 0 1115.9 6V4H8.133v2A1.467 1.467 0 115.2 6V4H2.533a1.187 1.187 0 00-1.2 1.207v14.92A1.187 1.187 0 002.5 21.333h19a1.186 1.186 0 001.166-1.206V5.207A1.186 1.186 0 0021.5 4zm-4.207 7.053L10.847 17.5l-3.514-3.54A.907.907 0 018.6 12.667l2.253 2.253L16 9.773a.91.91 0 011.287 1.287l.006-.007z" />
      </G>
      <Defs>
        <ClipPath id="clip0_5528_7856">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SyncEventIcon;
