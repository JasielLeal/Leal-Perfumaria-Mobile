import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert } from "react-native";
import { ModalDeAdicionarProduto } from "../components/ModalDeAdicionarProduto";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListaTodosOsProdutosCadastrados } from "../api/ListaTodosOsProdutosCadastrados/ListaTodosOsProdutosCadastrados";
import { formatCurrency } from "../utils/formatNumber";
import { useCallback, useEffect, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { SoftDelet } from "../api/SoftDelet/SoftDelet"
import { Button } from "../components/Button";
import { ModalDeEditProduct } from "../components/ModalDeEditProduct";
export function ListagemDePedidos() {

    const [search, setSearch] = useState('')
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(0);

    const { data, refetch, isPending } = useQuery({
        queryKey: ['ListaDeProdutosCadastrados'],
        queryFn: () => ListaTodosOsProdutosCadastrados({ search, take, skip }),

    });

    interface produtoProps {
        id: string,
        name: string,
        value: string,
        code: string
    }

    const handleSearchChange = useCallback((text: string) => {
        setSearch(text);
    }, []);

    useEffect(() => {
        refetch();
    }, [search, refetch]);

    return (
        <ScrollView>
            {isPending ?
                <View className="w-full h-screen justify-center items-center">
                    <ActivityIndicator size="large" color="#F43F5E" />
                </View>
                :
                <View className="w-full bg-[#f5f7fb] h-screen">
                    <View className="mt-16 flex flex-row items-center justify-between px-5">
                        <Button iconName="chevron-back" iconSize={20} routerBack="Home" />
                        <Text className="text-center font-semibold">Produtos cadastrados</Text>
                        <ModalDeAdicionarProduto />
                    </View>

                    <View className="px-5 mt-5" >
                        <TextInput
                            placeholder="Pesquisar"
                            className="bg-white p-3 rounded-md"
                            onChangeText={handleSearchChange}
                            value={search}
                        />
                    </View>

                    {data ?
                        data?.map((produto: produtoProps) => (
                            <View className="px-5 flex flex-row items-center mt-5 justify-between" key={produto.id}>
                                <View className="flex flex-row">
                                    <View className="p-3 bg-[#F43F5E] mr-3 rounded-full">
                                        <Text className="text-white">
                                            <Icon name="check" size={20} />
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="font-semibold text-xs">
                                            {produto.name}
                                        </Text>
                                        <Text className="text-gray-500 text-xs">
                                            {produto.code}
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex flex-row  gap-3">
                                    <Text className="font-medium text-xs flex justify-centers gap-2">
                                        R$ {produto.value ? formatCurrency(produto.value) : '00,00'}
                                    </Text>
                                    <View>
                                        <ModalDeEditProduct ProductIdProp={produto.id} />
                                    </View>
                                </View>

                            </View>

                        ))
                        :
                        <View className="flex justify-center items-center h-screen -mt-36">
                            <ActivityIndicator size="large" />
                        </View>
                    }
                </View>
            }
        </ScrollView>
    )
}