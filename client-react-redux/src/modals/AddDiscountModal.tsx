import { Modal as BaseModal } from "@mui/base/Modal";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import * as MUI from "@mui/material";
import { css, styled } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React from "react";
import { useAppDispatch } from "../redux/hooks/hooks";
import { IDiscount } from "../models/discount";
import { addDiscount, Discount } from "../redux/slices/discountSlice";

interface AddDiscountModalProps {
  open: boolean;                  // <-- Parent controls this
  onClose: () => void;           // <-- Parent callback to close
  productDiscountDto?: Discount; // Not strictly necessary
}

export default function AddDiscountModal({
  open,
  onClose,
  productDiscountDto
}: AddDiscountModalProps) {
  const dispatch = useAppDispatch();

  // Local state for the discount form
  const [discount, setDiscount] = React.useState<Discount>({
    id: "temp-id",    // Or generate an ID as needed
    value: 0
  });

  // Called when user clicks "Add"
  const handleAddDiscount = () => {
    // Dispatch the addDiscount action from discountSlice
    dispatch(addDiscount(discount));
    // Possibly close the modal afterward
    onClose();
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}          // <-- Controlled by parent
      onClose={onClose}
      closeAfterTransition
    >
      <MUI.Fade in={open}>
        <ModalContent sx={style}>
          {/* Header */}
          <MUI.Stack direction="row" justifyContent="space-between">
            <MUI.Typography variant="h6">Add Discount</MUI.Typography>
            <MUI.Button onClick={onClose} sx={{ color: "#000" }}>
              <CloseIcon />
            </MUI.Button>
          </MUI.Stack>

          <MUI.Divider />

          {/* Body */}
          <MUI.Stack gap={2} mt={1}>
            <MUI.TextField
              required
              label="Value"
              variant="outlined"
              size="small"
              value={discount.value}
              onChange={(event) => 
                setDiscount((prev) => ({
                  ...prev,
                  value: parseFloat(event.target.value) || 0
                }))
              }
            />

            {/* Example date fields, if needed */}
            {/* 
              We no longer rely on any 'startDate' / 'endDate' in the slice,
              because your current discountSlice doesn't define them. 
              But if you want them, add them to your slice + IDiscount interface.
            */}

            <MUI.Stack direction="row" spacing={2}>
              <LoadingButton
                loading={false /* No loading from slice */}
                variant="contained"
                color="primary"
                onClick={handleAddDiscount}
              >
                Add
              </LoadingButton>
              <MUI.Button onClick={onClose} variant="outlined" color="error">
                Cancel
              </MUI.Button>
            </MUI.Stack>
          </MUI.Stack>
        </ModalContent>
      </MUI.Fade>
    </Modal>
  );
}

// =========== STYLES ===========
const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: { xs: 300, md: 400 },
};

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid
      ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark"
        ? "rgb(0 0 0 / 0.5)"
        : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};
  `
);
