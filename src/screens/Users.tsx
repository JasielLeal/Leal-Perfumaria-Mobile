import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View, Text, Image } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RootStackParamList } from "../types/navigation";
import { useQuery } from "@tanstack/react-query";
import { ListarTodosOsUsuarios } from "../api/ListaTodosOsUsuarios/ListarTodosOsUsuarios";
import logo from '../../assets/logo.png';
export function Users() {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { data } = useQuery({
        queryKey: ['Users'],
        queryFn: () => ListarTodosOsUsuarios(),

    });

    interface UserProps {
        id: string
        name: string
        email: string
        isOwner: boolean
    }

    return (
        <View className="h-screen bg-[#f5f7fb]">
            <View className="px-5">
                <View className="mt-16 flex flex-row items-center justify-between">
                    <TouchableOpacity className="bg-[#F43F5E] flex rounded-md p-3" onPress={() => navigation.navigate('Home')}>
                        <Text className="text-white">
                            <Icon name="arrow-left" size={20} />
                        </Text>
                    </TouchableOpacity>
                    <Text className="text-center text-base font-semibold">Usuários</Text>
                    <Text className="text-center text-base font-semibold w-[50px]"></Text>
                </View>

                <View className="mt-5">
                    {data?.map((user: UserProps) => (
                        <View className="flex flex-row items-center justify-between" key={user.id}>
                            <View className="my-2">
                                <Text className="font-semibold text-base">{user?.name}</Text>
                                <Text className="text-sm font-medium text-gray-500" >{user?.email}</Text>
                            </View>
                            <View className="flex items-end">
                                <Text className="font-medium text-gray-500">Cargo</Text>
                                {user?.isOwner ? 'e' : <Text className="font-semibold">Administrador</Text>}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )
}