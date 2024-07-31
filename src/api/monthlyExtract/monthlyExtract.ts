import AsyncStorage from "@react-native-async-storage/async-storage";
import { backend } from "../api";

export interface monthlyExtractRequest {
  month: string;
  search: string | undefined;
  take: number;
  skip: number;
}

export async function monthlyExtract({
  month,
  search,
  skip,
  take,
}: monthlyExtractRequest) {
  const token = await AsyncStorage.getItem("@Token:");

  const response = await backend.get(`sale/monthlyextract/${month}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      search,
      take,
      skip,
    },
  });
  const teste = response.data
  return response.data;
}
