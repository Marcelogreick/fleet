import React from "react";

import { Container } from "./styles";
import { CarStatus } from "../../components/CarStatus";
import { HomeHeader } from "../../components/HomeHeader";
import { useNavigation } from "@react-navigation/native";

export function Home() {
  const { navigate } = useNavigation();

  function handleRegisterMoviment() {
    navigate("departure");
  }

  return (
    <Container>
      <HomeHeader />

      <CarStatus onPress={handleRegisterMoviment} />
    </Container>
  );
}
