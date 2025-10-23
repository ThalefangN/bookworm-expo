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

  // Prevent splash auto-hide
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  // Prepare app: check auth + load fonts
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

  // Wait until app is ready
  if (!appReady) return null;

  // Simply render the Slot, navigation will happen via folders
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
