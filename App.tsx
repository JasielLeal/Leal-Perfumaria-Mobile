import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/auth";
import { Routes } from "./src/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const client = new QueryClient()

export default function App() {

  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <QueryClientProvider client={client}>
          <NavigationContainer>
            <Routes />
            <Toast />
          </NavigationContainer>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}


