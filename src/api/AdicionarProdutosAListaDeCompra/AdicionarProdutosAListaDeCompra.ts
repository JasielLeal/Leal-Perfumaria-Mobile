import { FieldValues } from "react-hook-form";
import { backend } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function AdicionarProdutosAListaDeCompra(code: FieldValues) {

  const token = await AsyncStorage.getItem('@Token:');
  
  const response = await backend.post(`/bankproduct/find`, {
    code
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

  return response;
}
