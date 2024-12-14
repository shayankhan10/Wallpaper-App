import { View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import Footer from '../components/footer'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRouter, usePathname } from 'expo-router'; 
const Layout = () => {
  const pathname = usePathname(); 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="home/index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="home/image"
              options={{
                headerShown: false,
                presentation: 'transparentModal',
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="favorites/index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="upload/index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="generate/index"
              options={{
              headerShown: false,
                      }}
            />
            <Stack.Screen
              name="profile/index"
              options={{
                headerShown: false,
              }}
            />
          </Stack>

          {pathname !== '/' && <Footer />}
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;