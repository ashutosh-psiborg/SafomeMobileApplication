import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ResetIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M12 25v-2H8c-.55 0-1.02-.195-1.412-.587A1.93 1.93 0 016 21V9c0-.55.196-1.02.588-1.412A1.93 1.93 0 018 7h16c.55 0 1.021.196 1.413.588.392.392.588.863.587 1.412v5h-9.2l1.85-1.85-1.4-1.4L13 15l4.25 4.25 1.4-1.4L16.8 16H26v5c0 .55-.196 1.021-.587 1.413A1.92 1.92 0 0124 23h-4v2h-8z"
        fill="#000"
      />
    </Svg>
  );
}

export default ResetIcon;
