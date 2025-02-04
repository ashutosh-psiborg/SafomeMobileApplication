import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ProfileNotificationIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path d="M22 13a3 3 0 100-6 3 3 0 000 6z" fill="#000" />
      <Path
        d="M17 10c0-.712.153-1.387.422-2H10c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7.422A5 5 0 0122 15a5 5 0 01-5-5z"
        fill="#000"
      />
    </Svg>
  );
}

export default ProfileNotificationIcon;
