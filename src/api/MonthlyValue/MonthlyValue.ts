import AsyncStorage from "@react-native-async-storage/async-storage";
import { backend } from "../api";

export interface MonthlyValueRequest {
  month: string;
}

export async function MonthlyValue({ month}: MonthlyValueRequest) {
  const token = await AsyncStorage.getItem("@Token:");

  const response = await backend.get(`sale/monthlyvalue/${month}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
