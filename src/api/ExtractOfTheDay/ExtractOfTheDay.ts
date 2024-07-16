import AsyncStorage from "@react-native-async-storage/async-storage";
import { backend } from "../api";

export async function ExtractOfTheDay() {
  const token = await AsyncStorage.getItem("@Token:");

  const response = await backend.get(`sale/extractoftheday`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data
}
