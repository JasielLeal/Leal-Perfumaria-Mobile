import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BankProduct } from "./bankProduct";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegistrarProdutoSchema } from "../schemas/RegistrarProduto";
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdicionarProduto } from "../api/AdicionarProduto/AdicionarProduto";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from "react-native-toast-message";
import { formatCurrency } from "../utils/formatNumber";

export function ModalDeAdicionarProduto() {
    const [modalVisible, setModalVisible] = useState(false);
    const { control, handleSubmit, setValue, reset } = useForm({
        resolver: zodResolver(RegistrarProdutoSchema),
        mode: 'all',
        criteriaMode: 'all',
    });
    const queryClient = useQueryClient();

    const { mutateAsync: AdicionarProdutoFn } = useMutation({
        mutationFn: AdicionarProduto,
        onSuccess: () => {
            queryClient.invalidateQueries(['ListaDeProdutosCadastrados'] as InvalidateQueryFilters);
            setModalVisible(false);
            reset(); // Reset all form fields
            showToastSuccess();
        },
        onError: () => {
            setModalVisible(false);
            showToastError();
        },
    });

    const handleCodeScanned = (code: string) => {
        setValue('code', code);
    };

    const onSub = async (data: any) => {
        
        await AdicionarProdutoFn(data);
    };

    const showToastSuccess = () => {
        Toast.show({
            type: 'success',
            text1: 'Sucesso',
            text2: 'Produto cadastrado',
        });
    };

    const showToastError = () => {
        Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Algo deu errado ao cadastrar',
        });
    };

    const handleValueChange = (value: string) => {
        // Format the value and set it directly using `setValue`
        const formatted = formatCurrency(value);
        setValue('value', formatted);
    };

    return (
        <>
            <View>
                <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-[#F43F5E] rounded-md p-3">
                    <Text className="text-white">
                        <Icon name="plus" size={20} />
                    </Text>
                </TouchableOpacity>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(!modalVisible)}
                    className="z-50 absolute"
                >
                    <View className="bg-black bg-opacity-50 w-full h-screen flex justify-center items-center absolute z-50">
                        <View className="bg-white p-5 rounded-lg w-11/12 shadow-md">
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder="Nome do produto"
                                        autoCapitalize="sentences"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        className="bg-gray-200 rounded-md p-3 mb-3"
                                        placeholderTextColor={'#818181'}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="value"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder="Valor do produto"
                                        autoCapitalize="none"
                                        onBlur={onBlur}
                                        onChangeText={handleValueChange}
                                        value={value} // Directly bind value
                                        keyboardType="number-pad"
                                        className="bg-gray-200 rounded-md p-3 mb-3"
                                        placeholderTextColor={'#818181'}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="code"
                                render={({ field: { value, onChange } }) => (
                                    <>
                                        <BankProduct onCodeScanned={handleCodeScanned} />
                                        <TextInput
                                            placeholder="Código do produto"
                                            autoCapitalize="none"
                                            value={value}
                                            onChangeText={onChange}
                                            className="bg-gray-200 rounded-md p-3 mb-3"
                                            placeholderTextColor={'#818181'}
                                        />
                                    </>
                                )}
                            />
                            <TouchableOpacity onPress={handleSubmit(onSub)} className="bg-[#F43F5E] p-3 rounded-md my-3">
                                <Text className="text-white font-semibold text-center">Cadastrar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} className="border border-[#F43F5E] p-3 rounded-md">
                                <Text className="text-[#F43F5E] font-semibold text-center">Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
}
