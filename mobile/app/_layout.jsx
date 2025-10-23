import { SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../store/authStore";
import { Slot } from "expo-router";

export default function RootLayout() {
  const { checkAuth, user, token } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  // Wait for fonts and auth to load
  useEffect(() => {
    const prepareApp = async () => {
      await checkAuth();
      if (fontsLoaded) {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    };
    prepareApp();
  }, [fontsLoaded]);

  if (!appReady) return null;

  // Render auth flow if not signed in, else main tabs
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
