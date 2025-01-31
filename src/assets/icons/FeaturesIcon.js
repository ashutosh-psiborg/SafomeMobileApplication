import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function FeaturesIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M6.5 12.5h8v-1h-8v1zm0-3h8v-1h-8v1zM4.616 19c-.46 0-.845-.154-1.153-.462-.308-.308-.462-.693-.463-1.154V6.616c0-.46.154-.845.463-1.153A1.569 1.569 0 014.615 5h14.77c.46 0 .844.154 1.152.463.308.309.462.693.463 1.153v10.769c0 .46-.154.844-.463 1.153a1.56 1.56 0 01-1.152.462H4.616z"
        fill="#000"
      />
    </Svg>
  );
}

export default FeaturesIcon;
