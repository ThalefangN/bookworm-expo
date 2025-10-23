import { SplashScreen, Stack, useRouter, useSegments, Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();

  const [appReady, setAppReady] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  // Prevent splash screen from hiding
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  // Wait for fonts to load and auth check to finish
  useEffect(() => {
    const prepareApp = async () => {
      await checkAuth(); // Make sure auth state is loaded
      if (fontsLoaded) {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    };
    prepareApp();
  }, [fontsLoaded]);

  // Handle navigation after layout is mounted
  useEffect(() => {
    if (!appReady) return; // wait for fonts & auth
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) router.replace("/(auth)");
    else if (isSignedIn && inAuthScreen) router.replace("/(tabs)");
  }, [appReady, user, token, segments]);

  // While app is loading, render nothing (or a splash fallback)
  if (!appReady) return null;

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
