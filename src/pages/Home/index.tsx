import { useUser } from "@realm/react";
import { useQuery, useRealm } from "../../libs/realm";
import { Container, Label, Title } from "./styles";
import { CarStatus } from "../../components/CarStatus";
import { HomeHeader } from "../../components/HomeHeader";
import { useNavigation } from "@react-navigation/native";
import { Historic } from "../../libs/realm/scheme/Historic";
import { HistoricCard, HistoricCardProps } from "../../components/HistoricCard";
import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import dayjs from "dayjs";

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

  async function fetchHistoric() {
    try {
      const response = historic.filtered(
        "status='arrival' SORT(created_at DESC)"
      );

      // const lastSync = await getLastAsyncTimestamp();

      const formattedHistoric = response.map((item) => {
        return {
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSync: false,
          // isSync: lastSync > item.updated_at!.getTime(),
          created: dayjs(item.created_at).format(
            "[Saída em] DD/MM/YYYY [às] HH:mm"
          ),
        };
      });
      setVehicleHistoric(formattedHistoric);
    } catch (error) {
      console.log(error);
      Alert.alert("Histórico", "Não foi possível carregar o histórico.");
    }
  }

  function handleHistoricDetails(id: string) {
    navigate("arrival", { id });
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    fetchHistoric();
  }, [historic]);

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

      <FlatList
        data={vehicleHistoric}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HistoricCard
            data={item}
            onPress={() => handleHistoricDetails(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Label>Nenhum registro de utilização.</Label>}
      />
    </Container>
  );
}
