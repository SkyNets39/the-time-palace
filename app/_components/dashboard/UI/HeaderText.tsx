import { Box, Typography } from "@mui/material";

type Props = {
  title: string;
  description: string;
};

export default function HeaderText({ title, description }: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", mb: 3 }}>
      <Typography variant="h4" color="text.primary" fontFamily={"montserrat"}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}
