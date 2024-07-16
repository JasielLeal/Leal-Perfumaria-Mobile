import AsyncStorage from "@react-native-async-storage/async-storage";
import { backend } from "../api";

export async function ListarTodosOsUsuarios() {
  const token = await AsyncStorage.getItem("@Token:");
  const response = await backend.get("/user/getallusers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
