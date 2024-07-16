import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Platform, Text, TouchableOpacity, View, StyleSheet, TextInput, FlatList, ActivityIndicator, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { MonthlyValue, MonthlyValueRequest } from "../api/MonthlyValue/MonthlyValue";
import { formatCurrency } from "../utils/formatNumber";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { monthlyExtract, monthlyExtractRequest } from "../api/monthlyExtract/monthlyExtract";
import { RootStackParamList } from "../types/navigation";

export function Extrato() {

    interface monthProps {
        id: string
        customerName: string;
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
    }

    const monthsAll = [
        { id: 1, month: "Janeiro", value: "01" },
        { id: 2, month: "Fevereiro", value: "02" },
        { id: 3, month: "Março", value: "03" },
        { id: 4, month: "Abril", value: "04" },
        { id: 5, month: "Maio", value: "05" },
        { id: 6, month: "Junho", value: "06" },
        { id: 7, month: "Julho", value: "07" },
        { id: 8, month: "Agosto", value: "08" },
        { id: 9, month: "Setembro", value: "09" },
        { id: 10, month: "Outubro", value: "10" },
        { id: 11, month: "Novembro", value: "11" },
        { id: 12, month: "Dezembro", value: "12" },
    ];

    const [visible, setVisible] = useState(false);

    function visibleOn() {
        setVisible(!visible);
    }

    const styles = StyleSheet.create({
        pickerContainer: {
            height: 50,
            justifyContent: 'center',
            backgroundColor: '#F43F5E',
            marginTop: 20,
            marginBottom: 30,
            color: '#fff',
            ...Platform.select({
                android: {
                    borderRadius: 20,
                    // Outros estilos específicos do Android
                },
                ios: {
                    borderRadius: 20,
                    // Outros estilos específicos do iOS
                },
            }),
        },
    });

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [selectedValue, setSelectedValue] = useState('');
    const [search, setSearch] = useState('');
    const month = selectedValue;

    useEffect(() => {
        const currentMonth = new Date().getMonth() + 1;
        setSelectedValue(currentMonth.toString().padStart(2, '0'));
    }, []);

    const { data: MonthlyAmount } = useQuery({
        queryKey: ['MonthlyValue', month],
        queryFn: () => MonthlyValue({ month } as MonthlyValueRequest),
    });

    const { 
        data, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage 
    } = useInfiniteQuery({
        queryKey: ['MonthlyExtract', month, search],
        queryFn: ({ pageParam = 0 }) => monthlyExtract({ month, search, take: 10, skip: pageParam*10 } as monthlyExtractRequest),
        getNextPageParam: (lastPage, allPages) => lastPage.length === 10 ? allPages.length : undefined,
        initialPageParam: 0
    });

    return (
        <SafeAreaView>
            <View className="bg-[#f5f7fb] h-screen">
                <View className="px-5">
                    <View className="mt-16 flex flex-row items-center justify-between">
                        <TouchableOpacity className="bg-[#F43F5E] flex rounded-md p-3" onPress={() => navigation.navigate('Home')}>
                            <Text className="text-white">
                                <Icon name="arrow-left" size={20} />
                            </Text>
                        </TouchableOpacity>
                        <Text className="text-center text-base font-semibold">Extrato</Text>
                        <Text className="text-center text-base font-semibold w-[50px]"></Text>
                    </View>

                    <View className="mt-10">
                        <Text className="text-gray-600 font-medium">Saldo do mês</Text>
                        <View className="flex flex-row justify-between">
                            {
                                visible ?
                                    <>
                                        <Text className="text-xl font-semibold">{MonthlyAmount ? `R$ ${formatCurrency(String(MonthlyAmount))}` : 'R$ 00,00'}</Text>
                                        <TouchableOpacity onPress={visibleOn}>
                                            <Icon name="eye" size={18} color="#F43F5E" />
                                        </TouchableOpacity>
                                    </>
                                    :
                                    <>
                                        <Text className="text-xl font-semibold">
                                            R$ ****
                                        </Text>
                                        <TouchableOpacity onPress={visibleOn}>
                                            <Icon name="eye-slash" size={18} color="#F43F5E" />
                                        </TouchableOpacity>
                                    </>
                            }
                        </View>
                    </View>

                    <View className="my-5">
                        <TextInput
                            placeholder="Pesquisar"
                            className="bg-white p-3 rounded-md"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                    <View>
                        <Picker
                            style={styles.pickerContainer}
                            selectedValue={selectedValue}
                            onValueChange={(itemValue) => setSelectedValue(itemValue)}
                        >
                            {monthsAll.map((month) => (
                                <Picker.Item label={month.month} value={month.value} key={month.id} />
                            ))}
                        </Picker>
                    </View>

                    <FlatList
                        style={{ marginBottom: 550 }}
                        data={data?.pages.flatMap(page => page)}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate('DetalhesVenda', { month: item })}>
                                <View className="flex flex-row justify-between items-center p-3 bg-white rounded-lg my-2">
                                    <View className="flex flex-row justify-between items-center gap-10">
                                        <Icon name="money-bill-wave" size={18} color="#F43F5E" />
                                        <View>
                                            <Text className="font-semibold text-base">{item.customerName}</Text>
                                            <Text className="text-green-500 text-base text-semibold">R$ {formatCurrency(item.value)}</Text>
                                            <Text className="text-gray-600 font-semibold">Pix</Text>
                                        </View>
                                    </View>
                                    <Icons name="keyboard-arrow-right" size={28} color="#F43F5E" />
                                </View>
                            </TouchableOpacity>
                        )}
                        onEndReached={() => {
                            if (hasNextPage) {
                                fetchNextPage();
                            }
                        }}
                        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : <Text className="font-semibold text-center">Final da Lista</Text>}
                    />

                </View>
            </View>
        </SafeAreaView>
    );
}
