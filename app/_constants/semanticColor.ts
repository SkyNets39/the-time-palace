import { blue, grey, lightGreen, orange, red } from "@mui/material/colors";

export const getReservationStatusColor = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case "confirmed":
      return { bg: lightGreen[50], color: lightGreen[900] };
    case "pending":
      return { bg: blue[50], color: blue[900] };
    case "canceled":
      return { bg: red[50], color: red[900] };
    default:
      return { bg: grey[100], color: grey[800] };
  }
};

export const getWatchStatusColor = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case "available":
      return { bg: lightGreen[50], color: lightGreen[900] };
    case "sold":
      return { bg: red[50], color: red[900] };
    case "pending":
      return { bg: orange[50], color: orange[900] };
    default:
      return { bg: grey[100], color: grey[800] };
  }
};

export const getOrderStatusColor = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case "completed":
      return { bg: lightGreen[50], color: lightGreen[900] };
    case "refunded":
      return { bg: red[50], color: red[900] };
    default:
      return { bg: grey[100], color: grey[800] };
  }
};
