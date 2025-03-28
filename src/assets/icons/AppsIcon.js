import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function AppsIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M10.75 6.5A4.25 4.25 0 0115 10.75V15h-4.25a4.25 4.25 0 110-8.5zm0 10.5H15v4.25A4.25 4.25 0 1110.75 17zm10.5-10.5a4.25 4.25 0 110 8.5H17v-4.25a4.25 4.25 0 014.25-4.25zM17 17h4.25A4.25 4.25 0 1117 21.25V17z"
        fill="#000"
      />
    </Svg>
  );
}

export default AppsIcon;
