import { cn } from "@/lib/utils";
import React, { HtmlHTMLAttributes } from "react";

interface Props extends HtmlHTMLAttributes<HTMLHtmlElement> {
  children: React.ReactNode;
}

const DarkModeContainer: React.FC<Props> = ({
  children,
  className,
  ...props
}) => {
  return (
    <html {...props} className={cn("dark", className)}>
      {children}
    </html>
  );
};

export default DarkModeContainer;
