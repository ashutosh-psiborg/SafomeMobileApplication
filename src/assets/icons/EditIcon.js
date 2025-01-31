import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function EditIcon(props) {
  return (
    <Svg
      width={18}
      height={20}
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M15.925 1.137a3.027 3.027 0 00-4.283 0l-9.507 9.52a3.03 3.03 0 00-.885 2.14V16c0 .414.336.75.75.75h3.223c.803 0 1.573-.32 2.14-.887l9.5-9.506a3.03 3.03 0 000-4.28l-.938-.94zM1 18.25a.75.75 0 100 1.5h16a.75.75 0 100-1.5H1z"
        fill="#000"
      />
    </Svg>
  );
}

export default EditIcon;
