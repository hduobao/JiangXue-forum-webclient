import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  src: React.FC<React.SVGProps<SVGSVGElement>>;
}

const Icon: React.FC<IconProps> = ({ src: SvgComponent, ...props }) => {
  return <SvgComponent {...props} />;
};

export default Icon;
