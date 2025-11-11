import { Cliente } from "@/src/types/cliente";
import { GeocodingService } from "./GeocodingService";

export interface CityCluster {
    city: string;
    state: string;
    count: number;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    color: string;
    clients: Cliente[];
}

export interface StateCluster {
    state: string;
    count: number;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    color: string;
    cities: CityCluster[];
}

export interface ClienteLocation {
    cliente: Cliente;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

/**
 * Serviço para agrupar e clusterizar clientes por localização
 */
export class ClienteClusteringService {
    // Paleta de cores para os clusters
    private static readonly COLORS = [
        '#FF6B6B', // Vermelho
        '#4ECDC4', // Turquesa
        '#45B7D1', // Azul claro
        '#FFA07A', // Salmão
        '#98D8C8', // Verde menta
        '#F7DC6F', // Amarelo
        '#BB8FCE', // Roxo claro
        '#85C1E2', // Azul céu
        '#F8B739', // Laranja
        '#52B788', // Verde
        '#E63946', // Vermelho escuro
        '#457B9D', // Azul petróleo
    ];

    /**
     * Coordenadas aproximadas das principais cidades de PE
     */
    private static readonly CITY_COORDINATES: { [key: string]: { latitude: number; longitude: number } } = {
        'recife': { latitude: -8.0476, longitude: -34.8770 },
        'olinda': { latitude: -8.0089, longitude: -34.8551 },
        'jaboatão dos guararapes': { latitude: -8.1120, longitude: -35.0154 },
        'caruaru': { latitude: -8.2838, longitude: -35.9761 },
        'petrolina': { latitude: -9.3891, longitude: -40.5007 },
        'cabo de santo agostinho': { latitude: -8.2816, longitude: -35.0349 },
        'paulista': { latitude: -7.9406, longitude: -34.8732 },
        'garanhuns': { latitude: -8.8901, longitude: -36.4924 },
        'vitória de santo antão': { latitude: -8.1203, longitude: -35.2919 },
        'igarassu': { latitude: -7.8342, longitude: -34.9063 },
    };

    /**
     * Coordenadas dos estados do Brasil
     */
    private static readonly STATE_COORDINATES: { [key: string]: { latitude: number; longitude: number } } = {
        'PE': { latitude: -8.8137, longitude: -36.9541 },
        'SP': { latitude: -23.5505, longitude: -46.6333 },
        'RJ': { latitude: -22.9068, longitude: -43.1729 },
        'MG': { latitude: -19.9167, longitude: -43.9345 },
        'BA': { latitude: -12.9714, longitude: -38.5014 },
        'CE': { latitude: -3.7172, longitude: -38.5434 },
        'RS': { latitude: -30.0346, longitude: -51.2177 },
        'PR': { latitude: -25.4284, longitude: -49.2733 },
        'SC': { latitude: -27.5954, longitude: -48.5480 },
    };

    /**
     * Agrupa clientes por cidade
     */
    static groupByCity(clientes: Cliente[]): CityCluster[] {
        const cityMap = new Map<string, Cliente[]>();

        // Agrupar clientes por cidade
        clientes.forEach(cliente => {
            const key = `${cliente.city.toLowerCase()}-${cliente.state.toUpperCase()}`;
            if (!cityMap.has(key)) {
                cityMap.set(key, []);
            }
            cityMap.get(key)!.push(cliente);
        });

        // Converter para array de clusters
        const clusters: CityCluster[] = [];
        let colorIndex = 0;

        cityMap.forEach((clients, key) => {
            const [city, state] = key.split('-');
            const cityNormalized = city.toLowerCase();
            
            // Buscar coordenadas da cidade
            let coordinates = this.CITY_COORDINATES[cityNormalized];
            
            // Se não encontrar, usar coordenadas do estado com pequena variação
            if (!coordinates) {
                const stateCoords = this.STATE_COORDINATES[state];
                if (stateCoords) {
                    coordinates = {
                        latitude: stateCoords.latitude + (Math.random() - 0.5) * 0.5,
                        longitude: stateCoords.longitude + (Math.random() - 0.5) * 0.5,
                    };
                } else {
                    // Fallback para coordenadas padrão
                    coordinates = { latitude: -8.0476, longitude: -34.8770 };
                }
            }

            clusters.push({
                city: clients[0].city,
                state: state,
                count: clients.length,
                coordinates,
                color: this.COLORS[colorIndex % this.COLORS.length],
                clients,
            });

            colorIndex++;
        });

        return clusters;
    }

    /**
     * Agrupa clientes por estado
     */
    static groupByState(clientes: Cliente[]): StateCluster[] {
        const stateMap = new Map<string, Cliente[]>();

        // Agrupar clientes por estado
        clientes.forEach(cliente => {
            const state = cliente.state.toUpperCase();
            if (!stateMap.has(state)) {
                stateMap.set(state, []);
            }
            stateMap.get(state)!.push(cliente);
        });

        // Converter para array de clusters
        const clusters: StateCluster[] = [];
        let colorIndex = 0;

        stateMap.forEach((clients, state) => {
            const cityClustersByState = this.groupByCity(clients);
            
            // Buscar coordenadas do estado
            const coordinates = this.STATE_COORDINATES[state] || 
                { latitude: -8.0476, longitude: -34.8770 };

            clusters.push({
                state,
                count: clients.length,
                coordinates,
                color: this.COLORS[colorIndex % this.COLORS.length],
                cities: cityClustersByState,
            });

            colorIndex++;
        });

        return clusters;
    }

    /**
     * Gera coordenadas de polígono circular ao redor de um ponto
     * (simulação simplificada de área)
     */
    static generateCirclePolygon(
        center: { latitude: number; longitude: number },
        radiusInKm: number,
        points: number = 32
    ): { latitude: number; longitude: number }[] {
        const coords: { latitude: number; longitude: number }[] = [];
        const earthRadius = 6371; // raio da Terra em km

        for (let i = 0; i < points; i++) {
            const angle = (i * 360) / points;
            const angleRad = (angle * Math.PI) / 180;

            const latOffset = (radiusInKm / earthRadius) * (180 / Math.PI);
            const lonOffset = 
                (radiusInKm / earthRadius) * 
                (180 / Math.PI) / 
                Math.cos((center.latitude * Math.PI) / 180);

            const lat = center.latitude + latOffset * Math.sin(angleRad);
            const lon = center.longitude + lonOffset * Math.cos(angleRad);

            coords.push({ latitude: lat, longitude: lon });
        }

        return coords;
    }

    /**
     * Calcula o raio do polígono baseado na quantidade de clientes
     */
    static calculateRadius(count: number, isCity: boolean): number {
        if (isCity) {
            // Para cidades: raio menor, proporcional ao número de clientes
            return Math.min(5 + count * 0.5, 15); // Entre 5 e 15 km
        } else {
            // Para estados: raio maior
            return Math.min(30 + count * 2, 100); // Entre 30 e 100 km
        }
    }

    /**
     * Geocodifica clientes individuais
     */
    static async geocodeClientes(clientes: Cliente[]): Promise<ClienteLocation[]> {
        const locations: ClienteLocation[] = [];
        
        for (const cliente of clientes) {
            const coordinates = await GeocodingService.geocodeAddress(
                cliente.street,
                cliente.number,
                cliente.neighborhood,
                cliente.city,
                cliente.state,
                cliente.zipCode
            );
            
            if (coordinates) {
                locations.push({
                    cliente,
                    coordinates
                });
            }
        }
        
        return locations;
    }

    /**
     * Determina o nível de visualização baseado no zoom
     * @returns 'individual' | 'city' | 'state'
     */
    static getVisualizationLevel(latitudeDelta: number): 'individual' | 'city' | 'state' {
        if (latitudeDelta < 0.05) {
            return 'individual'; // Zoom muito próximo - mostra clientes individuais
        } else if (latitudeDelta < 1.0) {
            return 'city'; // Zoom intermediário - mostra cidades
        } else {
            return 'state'; // Zoom afastado - mostra estados
        }
    }

    /**
     * Determina se deve mostrar visualização de cidade ou estado baseado no zoom
     * @deprecated Use getVisualizationLevel() para suporte a três níveis
     */
    static shouldShowCities(latitudeDelta: number): boolean {
        return latitudeDelta < 1.0;
    }
}
