import { toast, ToastContent, ToastOptions } from "react-toastify";

export const helperToast = {
  success: (content: ToastContent, opts?: ToastOptions) => {
    toast.dismiss();
    toast.success(content, {
      ...opts,
      position: "top-right",
    });
  },
  error: (content: ToastContent, opts?: ToastOptions) => {
    toast.dismiss();
    toast.error(content, {
      ...opts,
      position: "top-right",
    });
  },
};
