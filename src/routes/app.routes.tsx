import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../pages/Home";
import { Departure } from "../pages/Departure";

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="departure" component={Departure} />
      {/* <Screen 
        name="arrival"
        component={Arrival}
      /> */}
    </Navigator>
  );
}
