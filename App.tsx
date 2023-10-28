import "react-native-get-random-values";
import "./src/libs/dayjs";

import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { ThemeProvider } from "styled-components/native";
import { AppProvider, UserProvider } from "@realm/react";

import theme from "./src/theme";

import { StatusBar } from "react-native";
import { SignIn } from "./src/pages/SignIn";
import { Loading } from "./src/components/Loading";
import { REALM_APP_ID } from "@env";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Routes } from "./src/routes";
import { RealmProvider, syncConfig } from "./src/libs/realm";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider style={{ backgroundColor: theme.COLORS.GRAY_800 }}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <UserProvider fallback={SignIn}>
            <RealmProvider fallback={Loading} sync={syncConfig}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
