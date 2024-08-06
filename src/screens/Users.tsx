import { View, Text, Image, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ListarTodosOsUsuarios } from "../api/ListaTodosOsUsuarios/ListarTodosOsUsuarios";
import { Button } from "../components/Button";

export function Users() {

    const { data } = useQuery({
        queryKey: ['Users'],
        queryFn: ListarTodosOsUsuarios,

    });
    interface UserProps {
        id: string
        name: string
        email: string
        isOwner: boolean
        avatar: string
    }
    
    return (
        <View className="h-screen bg-[#f5f7fb]">
            <View className="px-5">
                <View className="mt-16 flex flex-row items-center justify-between">
                    <Button iconName="chevron-back" iconSize={20} routerBack="Home" />
                    <Text className="text-center text-base font-semibold">Usuários</Text>
                    <Text className="text-center text-base font-semibold w-[50px]"></Text>
                </View>

                <View className="mt-5">
                    {data ?
                        data?.map((user: UserProps) => (
                            <View className="flex flex-row items-center" key={user.id}>
                                <View className="mr-3">
                                    <Image source={{ uri: user?.avatar }} resizeMode="contain" width={40} height={40} className="rounded-full" />
                                </View>
                                <View className="my-2">
                                    <Text className="font-semibold text-sm text-zinc-800">{user?.name}</Text>
                                    <Text className="text-xs font-medium text-zinc-500" >{user?.email}</Text>
                                </View>
                            </View>
                        ))
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} className="mt-10">
                            <ActivityIndicator size="large" />
                        </View>



                    }
                </View>
            </View>

        </View>
    )
}