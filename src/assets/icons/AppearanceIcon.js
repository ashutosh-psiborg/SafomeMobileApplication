import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function AppearanceIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M19.57 7.344l-1.428.781 1.428.781.78 1.428.782-1.428 1.428-.78-1.428-.782-.78-1.428-.782 1.428zM5.726 16c0-5.523 4.477-10 10-10h1.734l-.868 1.5c-.58 1-.866 2.19-.866 3.5a7 7 0 008.348 6.87l1.682-.327-.543 1.626A10 10 0 0115.727 26c-5.523 0-10.001-4.477-10.001-10zm18.5-5.584l.915 1.67L26.81 13l-1.67.914-.914 1.67-.913-1.67-1.67-.914 1.67-.914.914-1.67z"
        fill="#000"
      />
    </Svg>
  );
}

export default AppearanceIcon;
