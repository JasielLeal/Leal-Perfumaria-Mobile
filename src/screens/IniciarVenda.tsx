import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput, ScrollView } from "react-native";
import { Scanner } from "../components/Scanner";
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdicionarProdutosAListaDeCompra } from "../api/AdicionarProdutosAListaDeCompra/AdicionarProdutosAListaDeCompra";
import { FieldValues } from "react-hook-form";
import { CriarVenda } from "../api/CriarVenda/CriarVenda";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { calcularTotal, formatCurrency } from "../utils/formatNumber";
import Toast from "react-native-toast-message";

export interface productProps {
    id: string;
    name: string;
    qnt: string;
    value: string;
}

export function IniciarVenda() {
    const [products, setProducts] = useState<productProps[]>([]);
    const [productsBack, setProductsBack] = useState<{ code: string; amount: string }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [transictionType, setTransictionType] = useState('');
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const queryClient = useQueryClient();

    const showToast = (type: 'success' | 'error', text1: string, text2: string) => {
        Toast.show({
            type,
            text1,
            text2
        });
    };

    const calcularTotalGeral = () => {
        const total = products.reduce((acc, product) => {
            if (!product.qnt || !product.value) return acc;
            return acc + (Number(product.qnt) * Number(product.value) / 100);
        }, 0);
        return `R$ ${formatCurrency(total.toFixed(2))}`;
    };

    const { mutateAsync: AdicionarProdutosAListaDeCompraFn } = useMutation({
        mutationFn: AdicionarProdutosAListaDeCompra,
        onSuccess: (response) => {
            const newInputValue = inputValue || '1';
            const product = { id: response.data.id, qnt: newInputValue, name: response.data.name, value: response.data.value };
            const productNew = { code: response.data.code, amount: newInputValue };
            setProducts([...products, product]);
            setProductsBack([...productsBack, productNew]);
            console.log(productsBack)
            setInputValue('');
            setTransictionType('')
            showToast('success', 'Sucesso', 'Produto Adicionado');
        },
        onError: () => {
            showToast('error', 'Erro', 'Algo deu errado');
        },
    });

    const { mutateAsync: CriarVendaFn } = useMutation({
        mutationFn: CriarVenda,
        onSuccess: () => {
            queryClient.invalidateQueries(['MonthlyExtract'] as InvalidateQueryFilters);
            queryClient.invalidateQueries(['MonthlyValue'] as InvalidateQueryFilters);
            setProducts([]);
            setProductsBack([])
            setCustomerName('');
            showToast('success', 'Sucesso', 'Venda criada com sucesso');
        },
        onError: () => {
            showToast('error', 'Erro', 'Erro ao criar a venda');
        },
    });

    const handleScan = async (code: FieldValues) => {
        try {
            await AdicionarProdutosAListaDeCompraFn(code);
        } catch (error) {
            console.error("Error adding product:", error);
            showToast('error', 'Erro', 'Algo deu errado ao adicionar o produto');
        }
    };

    const handleCreateSale = async () => {
        if (!customerName) {
            showToast('error', 'Erro', 'Por favor, insira o nome do cliente');
            return;
        }
        if (productsBack.length === 0) {
            showToast('error', 'Erro', 'Por favor, adicione produtos à venda');
            return;
        }
        try {
            await CriarVendaFn({ customerName, products: productsBack, transictionType });
        } catch (error) {
            console.error("Error creating sale:", error);
            showToast('error', 'Erro', 'Erro ao criar a venda');
        }
    };

    return (
        <ScrollView>
            <View className="mt-16 flex flex-row items-center justify-between px-5">
                <TouchableOpacity className="bg-[#F43F5E] flex rounded-md p-3" onPress={() => navigation.navigate('Home')}>
                    <Text className="text-white">
                        <Icon name="arrow-left" size={20} />
                    </Text>
                </TouchableOpacity>
                <Text className="text-center text-base font-semibold">Produtos cadastrados</Text>
                <Text className="text-center text-base font-semibold w-[50px]"></Text>
            </View>
            <View className="px-5 mt-10">
                <TextInput
                    placeholder="Digite o nome do cliente"
                    className="bg-white p-3 rounded-md"
                    value={customerName}
                    onChangeText={setCustomerName}
                />

                <TextInput
                    className="bg-white p-3 rounded-md  mt-5"
                    placeholder="Forma de pagamento"
                    value={transictionType}
                    onChangeText={setTransictionType}
                />

                <TextInput
                    className="bg-white p-3 rounded-md  mt-5"
                    placeholder="Quantidade"
                    keyboardType="number-pad"
                    value={inputValue}
                    onChangeText={setInputValue}
                />

                <Scanner onScan={handleScan} />



                <View>
                    <View className="flex flex-row justify-between mt-10">
                        <View className="flex flex-row gap-5">
                            <Text className="font-semibold">Qnt</Text>
                            <Text className="font-semibold">Produto</Text>
                        </View>
                        <Text className="font-semibold">Valor</Text>
                    </View>

                    {products.map((product) => (
                        <View className="flex flex-row justify-between mt-5" key={product.id}>
                            <View className="flex flex-row gap-5">
                                <Text className="w-[50px]">{product.qnt}</Text>
                                <Text className="pl-4">{product.name}</Text>
                            </View>
                            <Text>
                                {calcularTotal(product)}
                            </Text>
                        </View>
                    ))}

                    <View className="flex flex-row items-center justify-between mt-10">
                        <Text className="text-xl font-semibold">
                            Valor total:
                        </Text>
                        <Text className="text-xl font-semibold">
                            {calcularTotalGeral()}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={handleCreateSale}>
                        <Text className="bg-[#F43F5E] text-white text-center font-semibold p-4 rounded-md text-base mt-10">Finalizar Pedido</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
