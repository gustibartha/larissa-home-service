import * as React from "react";

// Minimal Slot: merges its props/className onto a single child element.
export const Slot = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => {
  if (!React.isValidElement(children)) return null;
  const child = children as React.ReactElement<Record<string, unknown>>;
  const childProps = child.props;

  return React.cloneElement(child, {
    ...props,
    ...childProps,
    className: [
      (props as { className?: string }).className,
      childProps.className as string | undefined,
    ]
      .filter(Boolean)
      .join(" "),
    ref,
  });
});
Slot.displayName = "Slot";
