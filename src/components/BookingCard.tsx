import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Tipagem das props do componente
type BookingCardProps = {
  tipoQuarto: "Quarto duplo" | "Quarto solo" | "Quarto casal";
  numeroQuarto: number;
  cliente: string;
  dataCheckin: string;
  dataCheckout: string;
  numeroHospedes: number;
};

/**
 * Componente visual para exibir informações de uma reserva de hotel.
 * Usado na tela inicial para gerentes visualizarem as próximas reservas.
 */
const BookingCard: React.FC<BookingCardProps> = ({
  tipoQuarto,
  numeroQuarto,
  cliente,
  dataCheckin,
  dataCheckout,
  numeroHospedes,
}) => {
  return (
    // Container principal com borda, arredondamento e fundo transparente
    <View style={styles.card}>
      {/* Primeira linha: tipo do quarto e número */}
      <View style={styles.row}>
        <Text style={styles.tipoQuarto}>{tipoQuarto}</Text>
        <Text style={styles.numeroQuarto}>Nº{numeroQuarto}</Text>
      </View>
      {/* Segunda linha: informações detalhadas */}
      <View style={styles.infoCol}>
        <Text style={styles.infoText}>Cliente: {cliente}</Text>
        <Text style={styles.infoText}>Data check-in: {dataCheckin}</Text>
        <Text style={styles.infoText}>Data check-out: {dataCheckout}</Text>
        <Text style={styles.infoText}>Número de hóspedes: {numeroHospedes}</Text>
      </View>
    </View>
  );
};

// Estilos conforme especificações
const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#C4C4C4",
    borderRadius: 16,
    backgroundColor: "transparent",
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipoQuarto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#718FE9",
  },
  numeroQuarto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#063472",
    marginLeft: 16,
  },
  infoCol: {
    flexDirection: "column",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#063472",
  },
});

export default BookingCard;