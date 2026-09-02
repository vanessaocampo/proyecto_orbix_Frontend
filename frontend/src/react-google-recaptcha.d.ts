declare module "react-google-recaptcha" {
  import * as React from "react";

  interface ReCAPTCHAClass {
    execute(): void;
    reset(): void;
  }

  interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    className?: string;
    theme?: "light" | "dark";
    size?: "invisible" | "normal" | "compact";
    tabindex?: number;
  }

  const ReCAPTCHA: React.ForwardRefExoticComponent<
    ReCAPTCHAProps & React.RefAttributes<ReCAPTCHAClass>
  >;

  export default ReCAPTCHA;
}