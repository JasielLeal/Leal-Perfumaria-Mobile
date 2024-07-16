import { FieldValues } from "react-hook-form";
import { backend } from "../api";

export async function Session(data: FieldValues) {
 
  const response = await backend.post(`/user/auth`, {
    email: data.email,
    password: data.password,
  });

  return response;
}
