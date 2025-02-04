import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function LanguageIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_4054_25260)" fill="#000">
        <Path d="M11.334 15l-.667 2.067H12L11.334 15z" />
        <Path d="M24.2 6H13.533v3.333H16.2v1.334H7.533c-1.133 0-2 .866-2 2V20c0 1.133.867 2 2 2H8.2v3.4l4.2-3.4h4.466v-4.667H24.2c1.133 0 2-.866 2-2V8c0-1.133-.867-2-2-2zM12.733 19.267L12.4 18.2h-2.067l-.4 1.067h-1.6l2.2-5.934h1.6l2.2 5.934h-1.6zM22.866 14v1.333c-.866 0-1.8-.266-2.6-.666-.8.4-1.733.6-2.666.666L17.533 14c.467 0 .933-.067 1.4-.2-.6-.6-1-1.333-1.2-2.133h1.4c.2.6.6 1.066 1.067 1.466.733-.6 1.2-1.466 1.267-2.466h-4V9.333h2V8H20.8v1.333H23l.067.667c.066 1.4-.467 2.8-1.467 3.8.466.133.866.2 1.266.2z" />
      </G>
      <Defs>
        <ClipPath id="clip0_4054_25260">
          <Path fill="#fff" transform="translate(4 4)" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default LanguageIcon;
