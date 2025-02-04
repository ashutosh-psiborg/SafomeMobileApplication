import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function PrivacyIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_4054_25364)">
        <Path
          d="M15 5a1 1 0 112 0 1 1 0 01-2 0zm-8 6a1 1 0 100-2 1 1 0 000 2zm4-4a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2zm4 4a1 1 0 100-2 1 1 0 000 2zM14.69 23.883a9.599 9.599 0 01-.59-2.2 5.96 5.96 0 01-3.995-6.778L13.6 18.4v.8a1.6 1.6 0 00.4 1.045V16h-1.2v-1.6h1.6a.8.8 0 00.8-.8V12h1.6a1.6 1.6 0 001.59-1.5 6 6 0 012.353 1.857L22 11.833l1.08.45a7.997 7.997 0 10-8.39 11.6zM11 25a1 1 0 100 2 1 1 0 000-2zm5 1a1 1 0 100 2 1 1 0 000-2zm-9-5a1 1 0 100 2 1 1 0 000-2zm-2-6a1 1 0 100 2 1 1 0 000-2zm23 1.5v3.863A8.171 8.171 0 0122 28a8.12 8.12 0 01-6-7.596V16.5l6-2.5 6 2.5z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_4054_25364">
          <Path fill="#fff" transform="translate(4 4)" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default PrivacyIcon;
