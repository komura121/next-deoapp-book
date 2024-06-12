// components/ImageWithFetchPriority.js
import React from 'react';
import Image from 'next/image';

const ImageWithFetchPriority = React.forwardRef(({ fetchPriority, ...props }, ref) => (
  <Image ref={ref} {...props} priority={fetchPriority === 'high' ? true : undefined} />
));

export default ImageWithFetchPriority;
