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
import { Button } from "../components/Button";

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

    const { data: MonthlyAmount, isPending } = useQuery({
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
        queryFn: ({ pageParam = 0 }) => monthlyExtract({ month, search, take: 10, skip: pageParam * 10 } as monthlyExtractRequest),
        getNextPageParam: (lastPage, allPages) => lastPage.length === 10 ? allPages.length : undefined,
        initialPageParam: 0
    });

    return (
        <>
            <View className="bg-[#f5f7fb] h-screen">
                <View className="px-5 mt-16">
                    <View className="flex flex-row items-center justify-between">
                        <Button iconSize={20} iconName="chevron-back" routerBack="Home"/>
                        <Text className="text-center text-base font-semibold text-zinc-800">Extrato</Text>
                        <Text className="text-center text-base font-semibold w-[50px]"></Text>
                    </View>

                    <View className="mt-5">
                        <Text className="text-zinc-800 font-medium text-xs">Saldo do mês</Text>
                        <View className="flex flex-row justify-between">
                            {
                                visible ?
                                    <>
                                        <Text className="text-zinc-800 font-semibold">{MonthlyAmount ? `R$ ${formatCurrency(String(MonthlyAmount))}` : 'R$ 00,00'}</Text>
                                        <TouchableOpacity onPress={visibleOn}>
                                            <Icon name="eye" size={18} color="#F43F5E" />
                                        </TouchableOpacity>
                                    </>
                                    :
                                    <>
                                        <Text className="text-zinc-800 font-semibold">
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
                        style={{ marginBottom: 450 }}
                        data={data?.pages.flatMap(page => page)}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate('DetalhesVenda', { month: item })} key={item.createdAt}>
                                <View className="flex flex-row justify-between items-center p-3 bg-white rounded-xl my-2" key={item.id}>
                                    <View className="flex flex-row justify-between items-center gap-5" >
                                        <View className="border border-[#00000018] rounded-lg p-3">
                                            <Icon name="money-bill-wave" size={18} color="#F43F5E" />
                                        </View>
                                        <View>
                                            <Text className="font-semibold text-xs">{item.customerName}</Text>
                                            <Text className="text-gray-600 font-semibold text-xs">{item.transictionType}</Text>
                                        </View>
                                    </View>
                                    <View className="flex items-end">
                                        <Text>R$ {formatCurrency(item.value)}</Text>
                                        <Icons name="keyboard-arrow-right" size={28} color="#F43F5E" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        onEndReached={() => {
                            if (hasNextPage) {
                                fetchNextPage();
                            }
                        }}
                       
                    />

                </View>
            </View>
        </>
    );
}
