import type { JSX, PropsWithChildren } from "hono/jsx";

type Lol = JSX.IntrinsicElements["button"];

interface ButtonProps extends Lol {
  variant?: "primary" | "secondary";
  size: "m" | "s" | "l";
}

export const Button = ({
  children,
  variant,
  size,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button data-variant={variant} data-size={size} {...props}>
      {children}
    </button>
  );
};
