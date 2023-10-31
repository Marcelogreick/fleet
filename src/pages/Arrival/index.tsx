import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { X } from "phosphor-react-native";
import { BSON } from "realm";
import { LatLng } from "react-native-maps";

import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { Map } from "../../components/Map";

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
  AsyncMessage,
} from "./styles";

import { useObject, useRealm } from "../../libs/realm";
import { getLastAsyncTimestamp } from "../../libs/asyncStorage/syncStorage";
import { getStorageLocations } from "../../libs/asyncStorage/locationStorage";
import { stopLocationTask } from "../../tasks/backgroundLocationTask";
import { getAddressLocation } from "../../utils/getAddressLocation";
import { LocationInfoProps } from "../../components/LocationInfo";
import { Historic } from "../../libs/realm/scheme/Historic";
import { ButtonIcon } from "../../components/Buttonicon";
import dayjs from "dayjs";

type RouteParamProps = {
  id: string;
};

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>(
    {} as LocationInfoProps
  );
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const route = useRoute();
  const { id } = route.params as RouteParamProps;

  const realm = useRealm();
  const { goBack } = useNavigation();
  // @ts-ignore
  const historic = useObject(Historic, new BSON.UUID(id));
  // @ts-ignore
  const title = historic?.status === "departure" ? "Chegada" : "Detalhes";

  function handleRemoveVehicleUsage() {
    Alert.alert("Cancelar", "Cancelar a utilização do veículo?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => removeVehicleUsage() },
    ]);
  }

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic);
    });

    await stopLocationTask();

    goBack();
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          "Erro",
          "Não foi possível obter os dados para registrar a chegada do veículo."
        );
      }

      const locations = await getStorageLocations();

      realm.write(() => {
        // @ts-ignore
        historic.status = "arrival";
        // @ts-ignore
        historic.updated_at = new Date();
        // @ts-ignore
        historic.coords.push(...locations);
      });

      await stopLocationTask();

      realm.write(() => {
        // @ts-ignore
        historic.status = "arrival";
        // @ts-ignore
        historic.updated_at = new Date();
      });

      Alert.alert("Chegada", "Chegada registrada com sucesso.");
      goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível registar a chegada do veículo.");
    }
  }

  async function getLocationsInfo() {
    if (!historic) {
      return;
    }

    const lastSync = await getLastAsyncTimestamp();
    // @ts-ignore
    const updatedAt = historic!.updated_at.getTime();
    setDataNotSynced(updatedAt > lastSync);
    // @ts-ignore
    if (historic?.status === "departure") {
      const locationsStorage = await getStorageLocations();
      setCoordinates(locationsStorage);
    } else {
      // @ts-ignore
      setCoordinates(historic?.coords ?? []);
    }

    // @ts-ignore
    if (historic?.coords[0]) {
      // @ts-ignore
      const departureStreetName = await getAddressLocation(historic?.coords[0]);

      setDeparture({
        label: `Saíndo em ${departureStreetName ?? ""}`,
        // @ts-ignore
        description: dayjs(new Date(historic?.coords[0].timestamp)).format(
          "DD/MM/YYYY [às] HH:mm"
        ),
      });
    }

    // @ts-ignore
    if (historic?.status === "arrival") {
      // @ts-ignore
      const lastLocation = historic.coords[historic.coords.length - 1];
      const arrivalStreetName = await getAddressLocation(lastLocation);

      setArrival({
        label: `Chegando em ${arrivalStreetName ?? ""}`,
        description: dayjs(new Date(lastLocation.timestamp)).format(
          "DD/MM/YYYY [às] HH:mm"
        ),
      });
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getLocationsInfo();
  }, [historic]);

  return (
    <Container>
      <Header title={title} />

      {coordinates.length > 0 && <Map coordinates={coordinates} />}

      <Content>
        <Label>Placa do veículo</Label>
        {/* @ts-ignore */}
        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>
        {/* @ts-ignore */}
        <Description>{historic?.description}</Description>
      </Content>
      {/* @ts-ignore */}
      {historic?.status === "departure" && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />

          <Button title="Registrar chegada" onPress={handleArrivalRegister} />
        </Footer>
      )}

      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da {/* @ts-ignore */}
          {historic?.status === "departure" ? "partida" : "chegada"} pendente
        </AsyncMessage>
      )}
    </Container>
  );
}
