import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function AppsIcon(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M4.75.5A4.25 4.25 0 019 4.75V9H4.75a4.25 4.25 0 010-8.5zm0 10.5H9v4.25A4.25 4.25 0 114.75 11zM15.25.5a4.25 4.25 0 110 8.5H11V4.75A4.25 4.25 0 0115.25.5zM11 11h4.25A4.25 4.25 0 1111 15.25V11z"
        fill="#000"
      />
    </Svg>
  );
}

export default AppsIcon;
