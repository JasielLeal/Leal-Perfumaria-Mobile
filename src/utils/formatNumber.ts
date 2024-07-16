import { productProps } from "../screens/IniciarVenda";

export const formatCurrency = (value: string) => {
  const cleanValue = value.replace(/\D/g, "");
  const formattedValue = (Number(cleanValue) / 100).toFixed(2);
  return formattedValue.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const calcularTotal = (product: productProps) => {
  if (!product.qnt || !product.value) return "R$ 0,00";
  const total = (Number(product.qnt) * Number(product.value) / 100);
  return `R$ ${formatCurrency(total.toFixed(2).toString())}`;
};
