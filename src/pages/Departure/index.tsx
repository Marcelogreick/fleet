import { Container } from "./styles";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { LicensePlateInput } from "../../components/LicensePlateInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRef, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { TextAreaInput } from "../../components/TextAreaInput";

export function Departure() {
  const [description, setDescription] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          <LicensePlateInput
            ref={licensePlateRef}
            label="Placa do veículo"
            placeholder="BRA1234"
            onSubmitEditing={() => {
              descriptionRef.current?.focus();
            }}
            returnKeyType="next"
            // onChangeText={setLicensePlate}
          />
        </ScrollView>
      </KeyboardAwareScrollView>

      <TextAreaInput
        ref={descriptionRef}
        label="Finalizade"
        placeholder="Vou utilizar o veículo para..."
        // onSubmitEditing={handleDepartureRegister}
        returnKeyType="send"
        blurOnSubmit
        // onChangeText={setDescription}
      />

      <Button title="Registar Saída" />
    </Container>
  );
}
