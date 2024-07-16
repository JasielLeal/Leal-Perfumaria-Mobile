import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { SignIn } from '../screens/SignIn'

export function AuthRoutes() {

    const AuthStack = createStackNavigator()

    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name='SignIn' component={SignIn} options={{ headerShown: false }} />
        </AuthStack.Navigator>
    )
}