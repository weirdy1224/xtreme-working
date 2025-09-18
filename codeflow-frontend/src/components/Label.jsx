import * as React from "react";
import { clsx } from "clsx";

const labelBaseClasses = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

export const Label = React.forwardRef(function Label(
  { className, children, ...props },
  ref
) {
  return (
    <label
      ref={ref}
      className={clsx(labelBaseClasses, className)}
      {...props}
    >
      {children}
    </label>
  );
});
Label.displayName = "Label";
