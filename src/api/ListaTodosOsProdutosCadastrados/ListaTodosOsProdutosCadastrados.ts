import AsyncStorage from "@react-native-async-storage/async-storage";
import { backend } from "../api";

export interface GetAllPedidosResponse {
  take: number;
  skip: number;
  search: string;
}

export async function ListaTodosOsProdutosCadastrados({
  search,
  take,
  skip,
}: GetAllPedidosResponse) {
  const token = await AsyncStorage.getItem("@Token:");

  const response = await backend.get(`/bankproduct/getall`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      search,
      take,
      skip,
    },
  });

  return response.data;
}
