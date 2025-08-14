import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgArrowLeftThick = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <path
      d="M9.651 21.96a1.501 1.501 0 0 1-2.305-1.921l6.7-8.04-6.7-8.038a1.501 1.501 0 0 1 2.305-1.922l8.3 9.96z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgArrowLeftThick);
export default ForwardRef;
