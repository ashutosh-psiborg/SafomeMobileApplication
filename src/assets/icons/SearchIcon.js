import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SearchIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path d="M18 11a7.001 7.001 0 01-11.95 4.95A7 7 0 1118 11z" fill="#000" />
      <Path
        d="M20 20l-2-2"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default SearchIcon;
