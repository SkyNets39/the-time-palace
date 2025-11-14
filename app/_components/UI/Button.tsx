// src/components/atoms/Button.tsx
import { Button as MUIButton, ButtonProps } from "@mui/material";

type Props = ButtonProps & {
  fullWidthOnMobile?: boolean;
};

export default function Button({ fullWidthOnMobile, ...props }: Props) {
  return (
    <MUIButton
      {...props}
      sx={{
        textTransform: "none",

        ...(fullWidthOnMobile && {
          width: { xs: "100%", sm: "auto" },
        }),
        ...props.sx, // allow overrides
      }}
    />
  );
}
