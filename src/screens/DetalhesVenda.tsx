import { Text, View } from "react-native";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from "../utils/formatNumber";
import { Button } from "../components/Button";

export interface MonthlyExtractProps {
    route: {
        params: {
            month: {
                id: string
                customerName: string;
                transictionType: string;
                value: string;
                createdAt: string;
                saleProduct: [
                    {
                        amount: string;
                        BankProduct: {
                            name: string;
                            value: string
                        }
                        id: string

                    }
                ]
                // Adicione outros campos conforme necessário
                // Inclua todos os campos relevantes do objeto monthlyExtract
            };
        };
    };
}

export function DetalhesVenda({ route }: MonthlyExtractProps) {

    const { customerName, value, createdAt, saleProduct, id, transictionType } = route.params.month;

    return (
        <>
            <View className="px-5 h-screen bg-[#f5f7fb]">
                <View className="mt-16 flex flex-row items-center justify-between">
                    <Button iconSize={20} iconName="chevron-back" routerBack="Extrato" />
                    <Text className="text-center text-base font-semibold">Detalhes da Venda</Text>
                    <Text className="text-center text-base font-semibold w-[50px]"></Text>
                </View>
                <View className="p-3 rounded-lg bg-white mt-10">
                    <View className="flex flex-row justify-between">
                        <Text className="text-gray-600">Cliente</Text>
                        <Text className="font-semibold text-base">{customerName}</Text>
                    </View>
                    <View className="flex flex-row justify-between">
                        <Text className="text-gray-600">Valor</Text>
                        <Text className="font-semibold text-base">R$ {formatCurrency(value)}</Text>
                    </View>
                    <View className="flex flex-row justify-between">
                        <Text className="text-gray-600">Data da venda</Text>
                        <Text className="font-semibold text-sm capitalize">{format(createdAt, 'EEEE, dd/MM/yyyy', { locale: ptBR })}</Text>
                    </View>
                    <View className="flex flex-row justify-between">
                        <Text className="text-gray-600">Forma de Pagamento</Text>
                        <Text className="font-semibold text-base">{transictionType}</Text>
                    </View>
                    <Text className="font-semibold text-xl my-3">Produtos</Text>
                    {saleProduct?.map((product) => (
                        <View key={id}>
                            <View className="flex flex-row items-center justify-between">
                                <View className="flex flex-row items-center">
                                    <Text className="font-semibold text-base w-[25px]">{product.amount}</Text>
                                    <Text className="text-gray-600">{product.BankProduct.name}</Text>
                                </View>
                                <View>
                                    <Text className="text-gray-600">R$ {formatCurrency(product.BankProduct.value)}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

            </View>
        </>
    )
}