import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { clearAlert } from "../redux/slices/alertSlice";
// If you want MUI Modal or Dialog, import them:
// import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

const AlertModal: FC = () => {
  // Pull the current alert state
  const alert = useSelector((state: RootState) => state.alert);
  const dispatch = useDispatch();

  // Hide or close the modal by clearing the alert
  const hideModal = () => {
    dispatch(clearAlert());
  };

  // If there's no message, don't render anything
  if (!alert.message) {
    return null;
  }

  // Alternatively, use MUI's <Dialog> or <Modal>.
  // This is a minimal placeholder to show the concept:
  return (
    <div
      style={{
        position: "fixed",
        top: "30%",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        padding: "1rem",
        zIndex: 9999
      }}
    >
      <h3>Alert ({alert.type || "info"})</h3>
      <p>{alert.message}</p>
      <button onClick={hideModal}>Close</button>
    </div>
  );
};

export default AlertModal;
