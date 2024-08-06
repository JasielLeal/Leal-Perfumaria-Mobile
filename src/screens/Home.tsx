import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Card } from "../components/Card";
import AuthContext from "../context/auth";
import { useContext } from "react";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import Icons from 'react-native-vector-icons/MaterialIcons';
import { formatCurrency } from "../utils/formatNumber";
import { useQuery } from "@tanstack/react-query";
import { RecentSale } from "../api/RecentSale/RecentSale";
import { Button } from "../components/Button";
export function Home() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { user } = useContext(AuthContext)
    interface SaleProduct {
        amount: string;
        BankProduct: {
            name: string;
            value: string;
        };
        id: string;
    }

    const { data, isPending } = useQuery({
        queryKey: ['RecentSale'],
        queryFn: RecentSale,
    });

    interface monthProps {
        id: string;
        customerName: string;
        value: string;
        createdAt: string;
        transictionType: string
        saleProduct: SaleProduct[];
    }

    const test = 'https://i1.sndcdn.com/artworks-QZ4Y5bsDEMAIb7d8-G5oQQw-t500x500.jpg'

    return (
        <View className="bg-[#f5f7fb] h-screen">
            <View className="px-5 mt-5">
                <View className="flex flex-row mt-10 items-center justify-between mb-5">
                    <View className="flex flex-row items-center">
                        <Image source={{ uri: user?.avatar }} resizeMode="contain" width={60} height={60} className="rounded-full" />
                        <View className="ml-2">
                            <Text className="text-zinc-500 font-medium text-xs">Olá,</Text>
                            <Text className="font-semibold text-zinc-800 text-xs">{user?.name}</Text>
                        </View>
                    </View>
                    <View className="border border-[#00000018] rounded-xl">
                        <Button iconName="notifications-outline" iconSize={25} />
                    </View>
                </View>
                <Card />
                <View>
                    <Text className="font-semibold text-gray-600 mt-8 mb-3">Recentes</Text>
                    {isPending
                        ?
                        <View className="w-full bg-gray-200 rounded-xl py-7">
                            <ActivityIndicator size="large" color="#F43F5E" />
                        </View>
                        :
                        <>
                            {data?.map((month: monthProps) => (
                                <TouchableOpacity onPress={() => navigation.navigate('DetalhesVenda', { month })} key={month.createdAt}>
                                    <View className="flex flex-row justify-between items-center p-3 bg-white rounded-xl my-2" key={month.id}>
                                        <View className="flex flex-row justify-between items-center gap-5" >
                                            <View className="border border-[#00000018] rounded-lg p-3">
                                                <Icon name="money-bill-wave" size={18} color="#F43F5E" />
                                            </View>
                                            <View>
                                                <Text className="font-semibold text-base">{month.customerName}</Text>
                                                <Text className="text-gray-600 font-semibold">{month.transictionType}</Text>
                                            </View>
                                        </View>
                                        <View className="flex items-end">
                                            <Text>R$ {formatCurrency(month.value)}</Text>
                                            <Icons name="keyboard-arrow-right" size={28} color="#F43F5E" />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>
                    }
                </View>
            </View>
        </View>
    )
}