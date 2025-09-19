import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CrudItem from "@/src/components/CrudItem";
import Header from "@/src/components/Header";
import { router } from "expo-router";

export default function Crud() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{backgroundColor: "black", width: "100%", flex: 1}}>
                <View style={{backgroundColor: "white", flex: 1, width: "100%", height: "100%"}}>
                    <Header title={"CRUD"}/>
                    <View style={styles.mainContainer}>
                        <View style={styles.gridContainer}>
                            <View style={styles.gridRow}>
                                <CrudItem label="Clientes" onPress={() => router.navigate('screens/clientes')}>
                                    <FontAwesome name="users" size={64} color="#718FE9" />
                                </CrudItem>
                                <CrudItem label="Funcionários">
                                    <MaterialIcons name="engineering" size={64} color="#718FE9" />
                                </CrudItem>
                            </View>
                            <View style={styles.gridRow}>
                                <CrudItem label="Quartos">
                                    <MaterialCommunityIcons name="bed" size={64} color="#718FE9" />
                                </CrudItem>
                                <CrudItem label="Reservas">
                                    <FontAwesome6 name="bell-concierge" size={64} color="#718FE9" />
                                </CrudItem>
                            </View>
                            <View style={[styles.gridRow, {paddingHorizontal: 18, flexDirection: 'row'}]}>
                                <CrudItem label="Atividades Recreativas" long={true}>
                                    <FontAwesome6 name="ticket" size={64} color="#718FE9" />
                                </CrudItem>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%",
    },
    gridContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    gap: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 26,
    justifyContent: 'center'
  },
  gridItem: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#718FE9',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '50%',
    height: 160,
  },
  text: {
    fontSize: 24,
    color: "#718FE9",
    fontWeight: "bold",
    textAlign: 'center'
  }
})