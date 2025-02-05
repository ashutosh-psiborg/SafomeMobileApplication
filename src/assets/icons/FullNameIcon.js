import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function FullNameIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M15.29 14.677c-.148-.048-1.075-.466-.496-2.228h-.008c1.511-1.557 2.666-4.061 2.666-6.526 0-3.792-2.521-5.779-5.45-5.779-2.933 0-5.44 1.987-5.44 5.779 0 2.475 1.149 4.99 2.669 6.542.593 1.555-.467 2.132-.689 2.213-3.068 1.11-6.668 3.132-6.668 5.128v.75c0 2.72 5.274 3.338 10.156 3.338 4.888 0 10.096-.619 10.096-3.339v-.748c0-2.057-3.617-4.064-6.837-5.13z"
        fill="#000"
      />
    </Svg>
  );
}

export default FullNameIcon;
