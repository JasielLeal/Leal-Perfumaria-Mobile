import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import logo from '../../assets/logo.png'
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


    return (
        <View className="bg-[#f5f7fb] h-screen">

            <View className="px-5">
                <View className="flex flex-row mt-10 items-center justify-between mb-5">
                    <Image source={logo} style={{ width: 150, height: 70 }} resizeMode="contain" />
                    <Text className="font-semibold text-base text-gray-600">{user?.name}</Text>
                </View>
                <Card />

                <View>
                    <Text className="font-semibold text-gray-600 mt-8 mb-3">Recentes</Text>
                    {isPending ?
                        <View className="w-full bg-gray-200 rounded-lg py-7">
                            <ActivityIndicator size="large" color="#F43F5E" />
                        </View>
                        :
                        <>
                            {data?.map((month: monthProps) => (
                                <TouchableOpacity onPress={() => navigation.navigate('DetalhesVenda', { month })} key={month.createdAt}>
                                    <View className="flex flex-row justify-between items-center p-3 bg-white rounded-lg my-2" key={month.id}>
                                        <View className="flex flex-row justify-between items-center gap-10" >
                                            <Icon name="money-bill-wave" size={18} color="#F43F5E" />
                                            <View>
                                                <Text className="font-semibold text-base">{month.customerName}</Text>
                                                <Text className="text-green-500 text-base text-semibold">R$ {formatCurrency(month.value)}</Text>
                                                <Text className="text-gray-600 font-semibold">{month.transictionType}</Text>
                                            </View>
                                        </View>
                                        <Icons name="keyboard-arrow-right" size={28} color="#F43F5E" />
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