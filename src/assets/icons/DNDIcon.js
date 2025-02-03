import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function DNDIcon(props) {
  return (
    <Svg
      width={34}
      height={34}
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_4608_9027)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.575 9.575a10.5 10.5 0 1014.849 14.85A10.5 10.5 0 009.575 9.575zm13.79 6.675H10.637l-.001 1.501h12.728v-1.5z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_4608_9027">
          <Path
            fill="#fff"
            transform="rotate(-45 20.536 8.465)"
            d="M0 0H24V24H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default DNDIcon;
