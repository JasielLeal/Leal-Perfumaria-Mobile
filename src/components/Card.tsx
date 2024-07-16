import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { MonthlyValue, MonthlyValueRequest } from "../api/MonthlyValue/MonthlyValue";
import { formatCurrency } from "../utils/formatNumber";
import { ExtractOfTheDay } from "../api/ExtractOfTheDay/ExtractOfTheDay";
export function Card() {

    const [visible, setVisible] = useState(false)
    const [month, setMonth] = useState('')
    function visibleOn() {
        setVisible(!visible)
    }

    useEffect(() => {
        // Defina o mês atual como valor padrão
        const currentMonth = new Date().getMonth() + 1; // getMonth() retorna o mês de 0 a 11
        setMonth(currentMonth.toString().padStart(2, '0')); // Formate como string "01", "02", etc.
    }, []);

    const { data } = useQuery({
        queryKey: ['MonthlyValue'],
        queryFn: ExtractOfTheDay,
    });

    return (
        <>
            <View className="p-3 rounded-lg bg-white">
                <Text className="font-semibold text-xs">
                    Total de Vendas Diária
                </Text>
                <View className="flex flex-row items-center justify-between w-full">
                    {
                        visible ?
                            <>
                                <Text className="font-semibold text-3xl my-3 bg-rgb(244 63 94)">
                                    {data ? `R$ ${formatCurrency(String(data))}` : 'R$ 00,00'}
                                </Text>
                                <TouchableOpacity onPress={visibleOn}>
                                    <Icon name="eye" size={18} color="#F43F5E" />
                                </TouchableOpacity>
                            </>
                            :
                            <>
                                <Text className="font-semibold text-3xl my-3 bg-rgb(244 63 94)">
                                    R$ ****
                                </Text>
                                <TouchableOpacity onPress={visibleOn}>
                                    <Icon name="eye-slash" size={18} color="#F43F5E" />
                                </TouchableOpacity>
                            </>
                    }
                </View>
                <TouchableOpacity>
                    <Text className="text-rose-500 font-semibold">Ver extrato</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}