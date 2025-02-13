import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function PlusIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"
        fill="#000"
      />
    </Svg>
  );
}

export default PlusIcon;
