import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import { RootStackParamList } from "../types/navigation";
interface iconProps {
    iconSize: number
    iconName: string
    color?: string
    routerBack?: keyof RootStackParamList
}


export function Button({ iconName, iconSize, color, routerBack }: iconProps) {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <>
            <TouchableOpacity onPress={() => navigation.navigate(routerBack)}>
                <Text className="border-zinc-200 border p-2 text-zinc-500 rounded-lg">
                    <Icon name={iconName} size={iconSize} color={color} />
                </Text>
            </TouchableOpacity>
        </>
    )
}