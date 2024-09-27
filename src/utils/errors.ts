import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";

export function errorToast(err: unknown) {
  if (axios.isAxiosError(err)) {
    const axiosError = err as AxiosError;
    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      if (data instanceof Object && "message" in data) {
        toast.error((data as { message: string }).message);
        return;
      }
    }
  }
  toast.error("Something went wrong");
}

export function handleAPIError(err: unknown) {
  if ((err as Error).message === "Unauthorized") {
    throw new Error("Unauthorized");
  }
  if (axios.isAxiosError(err)) {
    const error = err as AxiosError;
    const data = error.response?.data;
    if (data) {
      const msg = (data as { message: string }).message;
      if (error.response?.status === 404 && msg !== "User does not exist") {
        return;
      }
      if (msg) {
        throw new Error(msg);
      }
    }
  }
  throw new Error("An error occurred");
}
