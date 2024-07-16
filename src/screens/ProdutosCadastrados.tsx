import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { ModalDeAdicionarProduto } from "../components/ModalDeAdicionarProduto";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListaTodosOsProdutosCadastrados } from "../api/ListaTodosOsProdutosCadastrados/ListaTodosOsProdutosCadastrados";
import { formatCurrency } from "../utils/formatNumber";
import { useCallback, useEffect, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { DeletarProdutoCadastrado } from "../api/DeletarProdutoCadastrado/DeletarProdutoCadastrado";
import logo from '../../assets/logo.png';
export function ListagemDePedidos() {

    const [search, setSearch] = useState('')
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(0);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { data, refetch } = useQuery({
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

    const queryClient = useQueryClient();

    const { mutateAsync: DeletarProdutoCadastradoFn, isPending, } = useMutation({
        mutationFn: DeletarProdutoCadastrado,
        onSuccess: () => {
            queryClient.invalidateQueries(['ListaDeProdutosCadastrados'] as InvalidateQueryFilters);
        },
        onError: (error) => {
            Alert.alert(`error, ${error}`)
        },
    });

    return (
        <ScrollView>
            {isPending ?
                <View className="w-full h-screen justify-center items-center">
                    <ActivityIndicator size="large" color="#F43F5E" />
                </View>
                :
                <View className="w-full bg-[#f5f7fb] h-screen">
                    <View className="mt-16 flex flex-row items-center justify-between px-5">
                        <TouchableOpacity className="bg-[#F43F5E] flex rounded-md p-3" onPress={() => navigation.navigate('Home')}>
                            <Text className="text-white">
                                <Icon name="arrow-left" size={20} />
                            </Text>
                        </TouchableOpacity>
                        <Text className="text-center text-base font-semibold">Produtos cadastrados</Text>
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



                    {data?.map((produto: produtoProps) => (
                        <View className="px-5 flex flex-row items-center mt-10 justify-between" key={produto.id}>
                            <View className="flex flex-row">
                                <View className="p-2 bg-[#F43F5E] rounded-md mr-3 ">
                                    <Text className="text-white">
                                        <Icon name="check" size={30} />
                                    </Text>
                                </View>
                                <View>
                                    <Text className="font-semibold text-sm ">
                                        {produto.name}
                                    </Text>
                                    <Text className="text-gray-500">
                                        {produto.code}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex flex-row items-center gap-3">
                                <Text className="font-medium text-base flex justify-centers gap-2">
                                    R$ {produto.value ? formatCurrency(produto.value) : '00,00'}
                                </Text>
                                <TouchableOpacity onPress={async () => await DeletarProdutoCadastradoFn(produto.code)}>
                                    <Feather name="trash-2" size={20} className="" color={'#F43F5E'} />
                                </TouchableOpacity>
                            </View>

                        </View>

                    ))

                    }
                </View>
            }
        </ScrollView>
    )
}