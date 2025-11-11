import { ClienteService } from "@/src/services/ClienteService";
import { ClienteClusteringService, CityCluster, StateCluster, ClienteLocation } from "@/src/services/ClienteClusteringService";
import { Cliente } from "@/src/types/cliente";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polygon, PROVIDER_DEFAULT, Region } from "react-native-maps";
import { Ionicons } from '@expo/vector-icons';

type VisualizationLevel = 'individual' | 'city' | 'state';

export default function MapaCliente() {
    const router = useRouter();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [cityCluster, setCityClusters] = useState<CityCluster[]>([]);
    const [stateClusters, setStateClusters] = useState<StateCluster[]>([]);
    const [clienteLocations, setClienteLocations] = useState<ClienteLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [visualizationLevel, setVisualizationLevel] = useState<VisualizationLevel>('state');
    const [selectedCluster, setSelectedCluster] = useState<CityCluster | StateCluster | null>(null);
    const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

    // Coordenadas iniciais (centro de Pernambuco)
    const [region, setRegion] = useState<Region>({
        latitude: -8.8137,
        longitude: -36.9541,
        latitudeDelta: 4.0,
        longitudeDelta: 4.0,
    });

    useEffect(() => {
        loadClientes();
    }, []);

    const loadClientes = async () => {
        try {
            setLoading(true);
            const data = await ClienteService.getAll();
            setClientes(data);
            
            // Agrupar clientes por cidade e estado
            const cities = ClienteClusteringService.groupByCity(data);
            const states = ClienteClusteringService.groupByState(data);
            
            setCityClusters(cities);
            setStateClusters(states);
            
            // Geocodificar clientes individuais em background
            ClienteClusteringService.geocodeClientes(data).then(locations => {
                setClienteLocations(locations);
            });
            
            // Ajustar região inicial baseado nos dados
            if (states.length > 0) {
                const lats = states.map(s => s.coordinates.latitude);
                const lons = states.map(s => s.coordinates.longitude);
                
                const minLat = Math.min(...lats);
                const maxLat = Math.max(...lats);
                const minLon = Math.min(...lons);
                const maxLon = Math.max(...lons);
                
                setRegion({
                    latitude: (minLat + maxLat) / 2,
                    longitude: (minLon + maxLon) / 2,
                    latitudeDelta: (maxLat - minLat) * 1.8 || 4.0,
                    longitudeDelta: (maxLon - minLon) * 1.8 || 4.0,
                });
                
                // Iniciar com visualização de estados (zoom afastado)
                setVisualizationLevel('state');
            }
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            Alert.alert('Erro', 'Não foi possível carregar os clientes');
        } finally {
            setLoading(false);
        }
    };

    const handleRegionChange = (newRegion: Region) => {
        console.log('📍 latitudeDelta:', newRegion.latitudeDelta);
        setRegion(newRegion);
        // Determinar nível de visualização baseado no zoom
        const level = ClienteClusteringService.getVisualizationLevel(newRegion.latitudeDelta);
        setVisualizationLevel(level);
        
        // Limpar seleções ao mudar de nível
        if (level !== visualizationLevel) {
            setSelectedCluster(null);
            setSelectedClient(null);
        }
    };

    const handleMarkerPress = (cluster: CityCluster | StateCluster) => {
        setSelectedCluster(cluster);
        setSelectedClient(null);
    };

    const handleClientMarkerPress = (cliente: Cliente) => {
        setSelectedClient(cliente);
        setSelectedCluster(null);
    };

    const handleViewClientDetails = () => {
        if (selectedClient) {
            router.push({
                pathname: "/screens/Cliente/InfoCliente",
                params: { id: selectedClient.id }
            });
        }
    };

    const handleViewClientsList = () => {
        if (selectedCluster) {
            // Fechar o modal
            setSelectedCluster(null);
            // Você pode implementar uma tela de lista de clientes filtrados aqui
            Alert.alert(
                'Clientes',
                `Mostrando ${selectedCluster.count} cliente(s)`
            );
        }
    };

    const closeClusterInfo = () => {
        setSelectedCluster(null);
    };

    const closeClientInfo = () => {
        setSelectedClient(null);
    };

    const renderPolygons = () => {
        if (visualizationLevel === 'city') {
            return cityCluster.map((cluster, index) => {
                const radius = ClienteClusteringService.calculateRadius(cluster.count, true);
                const polygon = ClienteClusteringService.generateCirclePolygon(
                    cluster.coordinates,
                    radius
                );
                
                return (
                    <Polygon
                        key={`city-${index}`}
                        coordinates={polygon}
                        fillColor={`${cluster.color}40`} // 40 = 25% opacity
                        strokeColor={cluster.color}
                        strokeWidth={2}
                    />
                );
            });
        } else if (visualizationLevel === 'state') {
            return stateClusters.map((cluster, index) => {
                const radius = ClienteClusteringService.calculateRadius(cluster.count, false);
                const polygon = ClienteClusteringService.generateCirclePolygon(
                    cluster.coordinates,
                    radius
                );
                
                return (
                    <Polygon
                        key={`state-${index}`}
                        coordinates={polygon}
                        fillColor={`${cluster.color}40`}
                        strokeColor={cluster.color}
                        strokeWidth={3}
                    />
                );
            });
        }
        // Não mostrar polígonos no nível individual
        return null;
    };

    const renderMarkers = () => {
        if (visualizationLevel === 'individual') {
            // Mostrar marcadores de clientes individuais
            return clienteLocations.map((location, index) => (
                <Marker
                    key={`client-${location.cliente.id}-${index}`}
                    coordinate={location.coordinates}
                    onPress={() => handleClientMarkerPress(location.cliente)}
                    anchor={{ x: 0.5, y: 0.5 }}
                    centerOffset={{ x: 0, y: 0 }}
                >
                    <View style={styles.clientMarkerContainer}>
                        <Ionicons name="person" size={16} color="white" />
                    </View>
                </Marker>
            ));
        } else if (visualizationLevel === 'city') {
            return cityCluster.map((cluster, index) => (
                <Marker
                    key={`city-marker-${index}`}
                    coordinate={cluster.coordinates}
                    onPress={() => handleMarkerPress(cluster)}
                    anchor={{ x: 0.5, y: 0.5 }}
                    centerOffset={{ x: 0, y: 0 }}
                >
                    <View style={[styles.markerContainer, { backgroundColor: cluster.color }]}>
                        <Text style={styles.markerText}>{cluster.count}</Text>
                    </View>
                </Marker>
            ));
        } else {
            return stateClusters.map((cluster, index) => (
                <Marker
                    key={`state-marker-${index}`}
                    coordinate={cluster.coordinates}
                    onPress={() => handleMarkerPress(cluster)}
                    anchor={{ x: 0.5, y: 0.5 }}
                    centerOffset={{ x: 0, y: 0 }}
                >
                    <View style={[styles.markerContainer, { backgroundColor: cluster.color }]}>
                        <Text style={styles.markerText}>{cluster.count}</Text>
                    </View>
                </Marker>
            ));
        }
    };

    const isCityCluster = (cluster: CityCluster | StateCluster): cluster is CityCluster => {
        return 'city' in cluster;
    };

    const getVisualizationLabel = () => {
        switch (visualizationLevel) {
            case 'individual':
                return 'Clientes';
            case 'city':
                return 'Cidades';
            case 'state':
                return 'Estados';
        }
    };

    const getVisualizationIcon = (): keyof typeof Ionicons.glyphMap => {
        switch (visualizationLevel) {
            case 'individual':
                return 'people';
            case 'city':
                return 'business';
            case 'state':
                return 'earth';
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ backgroundColor: "black", width: "100%", flex: 1 }}>
                <View style={{ backgroundColor: "white", flex: 1, width: "100%", height: "100%" }}>
                    {/* Header customizado com botão de voltar */}
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={28} color="#132F3B" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Mapa de Clientes</Text>
                        <TouchableOpacity 
                            style={styles.homeButton}
                            onPress={() => router.push("/screens/(tabs)")}
                        >
                            <Ionicons name="home" size={24} color="#132F3B" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.container}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#4BBAED" />
                                <Text style={styles.loadingText}>Carregando localizações...</Text>
                            </View>
                        ) : (
                            <>
                                <View style={styles.infoBar}>
                                    <Ionicons name="location" size={20} color="#4BBAED" />
                                    <Text style={styles.infoText}>
                                        {visualizationLevel === 'individual'
                                            ? `${clienteLocations.length} ${clienteLocations.length === 1 ? 'cliente' : 'clientes'}`
                                            : visualizationLevel === 'city'
                                            ? `${cityCluster.length} ${cityCluster.length === 1 ? 'cidade' : 'cidades'} com clientes`
                                            : `${stateClusters.length} ${stateClusters.length === 1 ? 'estado' : 'estados'} com clientes`
                                        }
                                    </Text>
                                    <View style={styles.zoomIndicator}>
                                        <Ionicons 
                                            name={getVisualizationIcon()} 
                                            size={16} 
                                            color="white" 
                                        />
                                        <Text style={styles.zoomText}>
                                            {getVisualizationLabel()}
                                        </Text>
                                    </View>
                                </View>

                                <MapView
                                    style={styles.map}
                                    provider={PROVIDER_DEFAULT}
                                    initialRegion={region}
                                    onRegionChangeComplete={handleRegionChange}
                                    showsUserLocation={false}
                                    showsMyLocationButton={false}
                                >
                                    {renderPolygons()}
                                    {renderMarkers()}
                                </MapView>

                                {/* Card de informação do cluster selecionado */}
                                {selectedCluster && (
                                    <View style={styles.clusterInfoCard}>
                                        <View style={styles.clusterInfoHeader}>
                                            <View style={styles.clusterHeaderLeft}>
                                                <View 
                                                    style={[
                                                        styles.colorIndicator, 
                                                        { backgroundColor: selectedCluster.color }
                                                    ]} 
                                                />
                                                <View>
                                                    <Text style={styles.clusterTitle}>
                                                        {isCityCluster(selectedCluster) 
                                                            ? selectedCluster.city 
                                                            : selectedCluster.state
                                                        }
                                                    </Text>
                                                    <Text style={styles.clusterSubtitle}>
                                                        {isCityCluster(selectedCluster) 
                                                            ? `${selectedCluster.state}`
                                                            : 'Estado'
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={closeClusterInfo}>
                                                <Ionicons name="close" size={24} color="#666" />
                                            </TouchableOpacity>
                                        </View>
                                        
                                        <View style={styles.clusterInfoContent}>
                                            <View style={styles.statsContainer}>
                                                <View style={styles.statItem}>
                                                    <Ionicons name="people" size={24} color="#4BBAED" />
                                                    <Text style={styles.statNumber}>{selectedCluster.count}</Text>
                                                    <Text style={styles.statLabel}>
                                                        {selectedCluster.count === 1 ? 'Cliente' : 'Clientes'}
                                                    </Text>
                                                </View>
                                                
                                                {!isCityCluster(selectedCluster) && (
                                                    <View style={styles.statItem}>
                                                        <Ionicons name="business" size={24} color="#45B7D1" />
                                                        <Text style={styles.statNumber}>
                                                            {selectedCluster.cities.length}
                                                        </Text>
                                                        <Text style={styles.statLabel}>
                                                            {selectedCluster.cities.length === 1 ? 'Cidade' : 'Cidades'}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            
                                            {!isCityCluster(selectedCluster) && selectedCluster.cities.length > 0 && (
                                                <View style={styles.citiesList}>
                                                    <Text style={styles.citiesListTitle}>Cidades com clientes:</Text>
                                                    {selectedCluster.cities.slice(0, 5).map((city, index) => (
                                                        <View key={index} style={styles.cityItem}>
                                                            <View 
                                                                style={[
                                                                    styles.cityColorDot, 
                                                                    { backgroundColor: city.color }
                                                                ]} 
                                                            />
                                                            <Text style={styles.cityName}>
                                                                {city.city}
                                                            </Text>
                                                            <Text style={styles.cityCount}>
                                                                ({city.count})
                                                            </Text>
                                                        </View>
                                                    ))}
                                                    {selectedCluster.cities.length > 5 && (
                                                        <Text style={styles.moreText}>
                                                            + {selectedCluster.cities.length - 5} mais
                                                        </Text>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                        
                                        <TouchableOpacity 
                                            style={styles.detailsButton}
                                            onPress={handleViewClientsList}
                                        >
                                            <Text style={styles.detailsButtonText}>Ver Lista de Clientes</Text>
                                            <Ionicons name="list" size={20} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Card de informação do cliente selecionado */}
                                {selectedClient && (
                                    <View style={styles.clientInfoCard}>
                                        <View style={styles.clientInfoHeader}>
                                            <Text style={styles.clientName}>{selectedClient.name}</Text>
                                            <TouchableOpacity onPress={closeClientInfo}>
                                                <Ionicons name="close" size={24} color="#666" />
                                            </TouchableOpacity>
                                        </View>
                                        
                                        <View style={styles.clientInfoContent}>
                                            <View style={styles.infoRow}>
                                                <Ionicons name="card" size={16} color="#666" />
                                                <Text style={styles.infoLabel}>CPF:</Text>
                                                <Text style={styles.infoValue}>{selectedClient.cpf}</Text>
                                            </View>
                                            
                                            <View style={styles.infoRow}>
                                                <Ionicons name="location" size={16} color="#666" />
                                                <Text style={styles.infoLabel}>Endereço:</Text>
                                            </View>
                                            <Text style={styles.addressText}>
                                                {selectedClient.street}, {selectedClient.number}
                                                {'\n'}{selectedClient.neighborhood} - {selectedClient.city}/{selectedClient.state}
                                                {'\n'}CEP: {selectedClient.zipCode}
                                            </Text>
                                            
                                            <View style={styles.infoRow}>
                                                <Ionicons name="call" size={16} color="#666" />
                                                <Text style={styles.infoLabel}>Telefone:</Text>
                                                <Text style={styles.infoValue}>{selectedClient.phone}</Text>
                                            </View>
                                            
                                            <View style={styles.infoRow}>
                                                <Ionicons name="mail" size={16} color="#666" />
                                                <Text style={styles.infoLabel}>Email:</Text>
                                                <Text style={styles.infoValue}>{selectedClient.email}</Text>
                                            </View>
                                        </View>
                                        
                                        <TouchableOpacity 
                                            style={styles.detailsButton}
                                            onPress={handleViewClientDetails}
                                        >
                                            <Text style={styles.detailsButtonText}>Ver Detalhes Completos</Text>
                                            <Ionicons name="arrow-forward" size={20} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EFEFF0',
        height: 80,
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 8,
    },
    homeButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#39AADE',
    },
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#132F3B',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: 'white',
    },
    infoBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a4455',
        paddingVertical: 10,
        gap: 8,
    },
    infoText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
        textAlign: 'center',
    },
    zoomIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    zoomText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    map: {
        flex: 1,
    },
    clientMarkerContainer: {
        backgroundColor: '#4BBAED',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    markerContainer: {
        width: 30,
        height: 30,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    markerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clusterInfoCard: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        maxHeight: '70%',
    },
    clusterInfoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 12,
    },
    clusterHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    colorIndicator: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    clusterTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#132F3B',
    },
    clusterSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    clusterInfoContent: {
        gap: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 12,
        gap: 4,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#132F3B',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    citiesList: {
        gap: 8,
    },
    citiesListTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#132F3B',
        marginBottom: 4,
    },
    cityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 4,
    },
    cityColorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    cityName: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    cityCount: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    moreText: {
        fontSize: 12,
        color: '#4BBAED',
        fontStyle: 'italic',
        marginTop: 4,
    },
    detailsButton: {
        flexDirection: 'row',
        backgroundColor: '#4BBAED',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    detailsButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    clientInfoCard: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        maxHeight: '60%',
    },
    clientInfoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 8,
    },
    clientName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#132F3B',
        flex: 1,
    },
    clientInfoContent: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    addressText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 22,
        marginBottom: 4,
    },
});
