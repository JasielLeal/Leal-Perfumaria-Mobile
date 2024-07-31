import { backend } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CriarVendaProsps {
  customerName: string;
  transictionType: string;
  products: { code: string; amount: string }[];
}

export async function CriarVenda({
  customerName,
  products,
  transictionType,
}: CriarVendaProsps) {
  const token = await AsyncStorage.getItem("@Token:");
  console.log(transictionType)
  const response = await backend.post(
    `sale/create`,
    {
      customerName,
      transictionType,
      products,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
}
