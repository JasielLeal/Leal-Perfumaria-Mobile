import { createContext, useEffect, useState } from "react";
import { Session } from "../api/Auth/Sesssion";
import { FieldValues } from "react-hook-form";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { ActivityIndicator, View, Image, ImageProps, ImageSourcePropType } from "react-native";
import logo from '../../assets/logo.png';
interface AuthContextData {
  signed: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    token: string;
    avatar: string
  } | null
  singInFc(data: FieldValues): Promise<void>
  loading: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  avatar: string
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }) {

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadStoragedData() {
      try {
        
        const storagedToken = await AsyncStorage.getItem('token');
        const storagedUser = await AsyncStorage.getItem('user');
        if (storagedToken && storagedUser) {
          setUser(JSON.parse(storagedUser));

          const decodedToken = jwtDecode(storagedToken);
          const currentDate = new Date();
          const expirationDate = new Date(Number(decodedToken?.exp) * 1000);

          if (expirationDate < currentDate) {
            await AsyncStorage.clear();
            setUser(null);
            console.log('Token expirou e os dados foram limpos.');
          }

        }
      } catch (error) {
        console.error('Erro ao carregar os dados do armazenamento:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStoragedData();
  }, []);

  async function singInFc(dataValue: FieldValues) {
    setLoading(true);

    const response = await Session(dataValue)
    const { data } = response
    setUser(data.user)
    await AsyncStorage.setItem('token', data.user.token)
    await AsyncStorage.setItem('user', JSON.stringify(data.user))
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, singInFc, loading }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={logo} style={{ width: 150, height: 70 }} resizeMode="contain" />
          <ActivityIndicator size="large" color="#F43F5E" />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export default AuthContext;
