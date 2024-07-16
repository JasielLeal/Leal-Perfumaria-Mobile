import { backend } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function DeletarProdutoCadastrado(code: string) {

  const token = await AsyncStorage.getItem("@Token:");

  const response = await backend.delete(`bankproduct/delete/${code}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}
