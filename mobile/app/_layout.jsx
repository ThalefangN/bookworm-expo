import { SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { useRouter, useSegments, Slot } from "expo-router";

import { useAuthStore } from "../store/authStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        {/* The Slot renders nested routes dynamically */}
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
