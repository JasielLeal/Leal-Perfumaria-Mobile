import React, { useContext } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import logo from '../../assets/logo.png';
import AuthContext from '../context/auth';

// Esquema de validação com Zod
const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export function SignIn() {

    const { singInFc } = useContext(AuthContext)
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'all',
        criteriaMode: 'all',
    });

    async function handleLogin(data: FieldValues) {
        try {
            await singInFc(data)
        } catch (error) {
            Alert.alert("Erro no Login", "Não foi possível realizar o login. Por favor, verifique suas credenciais e tente novamente.");
        }
    };

    return (
        <ScrollView >
            
            <View className="w-full justify-center h-screen items-center">
                <Image source={logo} style={{ width: 350, height: 70 }} resizeMode="contain" />
                <View className="w-full px-5">
                    <Text className="text-xl font-semibold text-center">Acesse a plataforma</Text>
                    <Text className="text-center">Faça o login para entrar no seu espaço digital.</Text>

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TextInput
                                    placeholder="E-mail"
                                    className={`bg-slate-100 p-3 rounded-md mt-5 ${errors.email ? 'border border-red-500' : ''}`}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors.email && <Text className="text-red-500">{errors.email.message as string}</Text>}
                            </>
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TextInput
                                    placeholder="Senha"
                                    className={`bg-slate-100 p-3 rounded-md mt-5 ${errors.password ? 'border border-red-500' : ''}`}
                                    secureTextEntry
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors.password && <Text className="text-red-500">{errors.password.message as string}</Text>}
                            </>
                        )}
                    />

                    <TouchableOpacity className="bg-[#F43F5E] p-3 mt-5 rounded-md" onPress={handleSubmit(handleLogin)}>
                        <Text className="text-center text-white">Entrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
