import { useUser } from "@realm/react";
import { useQuery, useRealm } from "../../libs/realm";

import { Container } from "./styles";
import { CarStatus } from "../../components/CarStatus";
import { HomeHeader } from "../../components/HomeHeader";
import { useNavigation } from "@react-navigation/native";
import { Historic } from "../../libs/realm/scheme/Historic";
import { HistoricCardProps } from "../../components/HistoricCard";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Title } from "../SignIn/styles";

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    []
  );

  const { navigate } = useNavigation();

  const historic = useQuery(Historic);
  const user = useUser();
  const realm = useRealm();

  function handleRegisterMoviment() {
    if (vehicleInUse?._id) {
      navigate("arrival", { id: vehicleInUse._id.toString() });
    } else {
      navigate("departure");
    }
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = historic.filtered("status='departure'")[0];
      setVehicleInUse(vehicle);
    } catch (error) {
      Alert.alert(
        "Veículo em uso",
        "Não foi possível carregar o veículo em uso."
      );
      console.log(error);
    }
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener("change", () => fetchVehicleInUse());
    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener("change", fetchVehicleInUse);
      }
    };
  }, []);

  return (
    <Container>
      <HomeHeader />

      <CarStatus
        licensePlate={vehicleInUse?.license_plate}
        onPress={handleRegisterMoviment}
      />

      <Title>Histórico</Title>
    </Container>
  );
}
