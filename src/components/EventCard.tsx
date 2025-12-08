import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Tipagem das props do componente
type EventCardProps = {
  titulo: string;
  local: string;
  horario: string;
  custo: string;
};

/**
 * Componente visual para exibir informações principais de um evento.
 * Usado para listar eventos ou atividades no app.
 */
const EventCard: React.FC<EventCardProps> = ({
  titulo,
  local,
  horario,
  custo,
}) => {
  return (
    // Container principal com borda, arredondamento e fundo branco
    <View style={styles.card}>
      {/* Título do evento */}
      <Text style={styles.titulo}>{titulo}</Text>
      {/* Detalhes do evento */}
      <Text style={styles.detalhe}>Local: {local}</Text>
      <Text style={styles.detalhe}>Horário: {horario}</Text>
      <Text style={styles.detalhe}>Custo: {custo}</Text>
    </View>
  );
};

// Estilos conforme especificações
const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 14,
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#718FE9",
    marginBottom: 8,
  },
  detalhe: {
    fontSize: 15,
    color: "#063472",
    marginBottom: 4,
  },
});

export default EventCard;