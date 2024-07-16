import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Attachmoney from 'react-native-vector-icons/MaterialIcons';
import { Home } from '../screens/Home';
import { Extrato } from '../screens/Extrato';
import { DetalhesVenda } from '../screens/DetalhesVenda';
import { IniciarVenda } from '../screens/IniciarVenda';
import { ListagemDePedidos } from '../screens/ProdutosCadastrados';
import { RootStackParamList } from '../types/navigation';
import { View, Platform } from 'react-native';
import { Users } from '../screens/Users';
import Awesome from 'react-native-vector-icons/FontAwesome';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function TabRoutes() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 0,
                    elevation: 10,
                    borderTopRightRadius: 25,
                    borderTopLeftRadius: 25,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 0, // Ajuste para iOS
                    paddingTop: Platform.OS === 'ios' ? 10 : 0, // Ajuste para iOS
                    ...Platform.select({
                        android: {
                            height: 80, // Altura para Android
                        },
                        ios: {
                            height: 100, // Altura para iOS
                        },
                    }),
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Icon name="home" size={size} color={focused ? '#F43F5E' : color} />
                    ),
                }}
            />

            <Tab.Screen
                name="Extrato"
                component={Extrato}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Attachmoney name="attach-money" size={30} color={focused ? '#F43F5E' : color} />
                    ),
                }}
            />

            <Tab.Screen
                name="Pedido"
                component={IniciarVenda}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{
                            width: 60,
                            height: 60,
                            backgroundColor: focused ? '#fff' : '#F43F5E',
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOpacity: 0.2,
                            shadowOffset: { width: 0, height: 10 },
                            shadowRadius: 10,
                            elevation: 5,
                        }}>
                            <Icon name="plus" size={25} color={focused ? '#F43F5E' : '#fff'} />
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Lista De Pedidos"
                component={ListagemDePedidos}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Attachmoney name="shopping-bag" size={30} color={focused ? '#F43F5E' : color} />
                    ),
                }}
            />

            <Tab.Screen
                name="user"
                component={Users}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Awesome  name="user" size={size} color={focused ? '#F43F5E' : color} />
                    ),
                }}
            />

        </Tab.Navigator>
    );
}

export default function AppRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="TabRoutes" component={TabRoutes} options={{ headerShown: false, animationEnabled: true }} />
            <Stack.Screen name="DetalhesVenda" component={DetalhesVenda} options={{ headerShown: false, title: 'Detalhes da Venda', headerTitleAlign: 'center', animationEnabled: true }} />
        </Stack.Navigator>
    );
}
