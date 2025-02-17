import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function ThreeDots(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_5528_9773)" fill="#000">
        <Path d="M12 4a2 2 0 100-4 2 2 0 000 4zM12 14a2 2 0 100-4 2 2 0 000 4zM12 24a2 2 0 100-4 2 2 0 000 4z" />
      </G>
      <Defs>
        <ClipPath id="clip0_5528_9773">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default ThreeDots;
