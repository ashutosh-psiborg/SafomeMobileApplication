import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function DeleteIcon({width = 20, height = 20, ...props}) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 512 512" // Ensures proper scaling
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      {...props}>
      <Path
        d="M172.5-.5h166c15.968 5.19 25.468 16.19 28.5 33a1112.992 1112.992 0 0181.5-.5c23.979 2.328 34.146 15.495 30.5 39.5-2.807 12.14-10.307 19.64-22.5 22.5a40198.49 40198.49 0 01-401 0C36.709 88.618 28.875 76.118 32 56.5 35.205 41.628 44.371 33.461 59.5 32c28.239-.828 56.405-.661 84.5.5 3.015-16.75 12.515-27.75 28.5-33z"
        opacity={0.99}
      />
      <Path
        d="M385.5 511.5h-261c-21.649-4.816-34.816-18.15-39.5-40a54805.99 54805.99 0 01-21.5-349h384a59118.29 59118.29 0 01-20.5 343c-2.942 25.43-16.775 40.764-41.5 46z"
        opacity={0.994}
      />
    </Svg>
  );
}

export default DeleteIcon;
