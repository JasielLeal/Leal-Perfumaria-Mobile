import { backend } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function SoftDelet(code: string) {

  const token = await AsyncStorage.getItem("@Token:");

  const response = await backend.put(`bankproduct/softdelet/${code}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}
