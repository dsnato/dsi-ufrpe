/**
 * Service para geocodificação de endereços
 * Converte endereços em coordenadas geográficas (latitude/longitude)
 */

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface GeocodedLocation {
    address: string;
    coordinates: Coordinates;
    clientName: string;
    clientId: string;
}

/**
 * Converte um endereço completo em coordenadas usando a API do Nominatim (OpenStreetMap)
 * Esta é uma alternativa gratuita ao Google Maps Geocoding API
 */
export class GeocodingService {
    private static readonly BASE_URL = 'https://nominatim.openstreetmap.org/search';
    
    /**
     * Geocodifica um endereço completo
     */
    static async geocodeAddress(
        street: string,
        number: string,
        neighborhood: string,
        city: string,
        state: string,
        zipCode: string
    ): Promise<Coordinates | null> {
        try {
            // Monta o endereço completo
            const fullAddress = `${street}, ${number}, ${neighborhood}, ${city}, ${state}, ${zipCode}, Brazil`;
            
            // Para desenvolvimento, vou usar coordenadas aproximadas baseadas no bairro de Recife
            // Em produção, você deve usar uma API de geocoding real
            const mockCoordinates = this.getMockCoordinatesForNeighborhood(neighborhood, city);
            
            if (mockCoordinates) {
                // Adiciona uma pequena variação aleatória para diferenciar clientes no mesmo bairro
                return {
                    latitude: mockCoordinates.latitude + (Math.random() - 0.5) * 0.005,
                    longitude: mockCoordinates.longitude + (Math.random() - 0.5) * 0.005
                };
            }
            
            // Fallback: usar API do Nominatim (com limite de requisições)
            const params = new URLSearchParams({
                q: fullAddress,
                format: 'json',
                limit: '1'
            });
            
            const response = await fetch(`${this.BASE_URL}?${params}`, {
                headers: {
                    'User-Agent': 'DSI-UFRPE-App/1.0'
                }
            });
            
            if (!response.ok) {
                console.error('Erro ao geocodificar endereço:', response.statusText);
                return null;
            }
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                return {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon)
                };
            }
            
            return null;
        } catch (error) {
            console.error('Erro ao geocodificar endereço:', error);
            return null;
        }
    }
    
    /**
     * Retorna coordenadas aproximadas para bairros conhecidos de Recife
     * Usado como mock para desenvolvimento
     */
    private static getMockCoordinatesForNeighborhood(neighborhood: string, city: string): Coordinates | null {
        if (city.toLowerCase() !== 'recife') {
            return null;
        }
        
        // Coordenadas aproximadas dos principais bairros de Recife
        const neighborhoods: { [key: string]: Coordinates } = {
            'centro': { latitude: -8.0589, longitude: -34.8841 },
            'boa vista': { latitude: -8.0547, longitude: -34.8929 },
            'casa forte': { latitude: -8.0197, longitude: -34.9298 },
            'espinheiro': { latitude: -8.0413, longitude: -34.8942 },
            'graças': { latitude: -8.0377, longitude: -34.8981 },
            'pina': { latitude: -8.0883, longitude: -34.8814 },
            'boa viagem': { latitude: -8.1189, longitude: -34.8975 },
            'imbiribeira': { latitude: -8.1028, longitude: -34.9289 },
            'cordeiro': { latitude: -8.0528, longitude: -34.9214 },
            'madalena': { latitude: -8.0514, longitude: -34.9122 },
            'derby': { latitude: -8.0519, longitude: -34.8913 },
            'torre': { latitude: -8.0506, longitude: -34.9056 },
            'várzea': { latitude: -8.0406, longitude: -34.9619 },
            'jardim são paulo': { latitude: -8.0858, longitude: -34.9361 },
            'afogados': { latitude: -8.0706, longitude: -34.9192 },
            'san martin': { latitude: -8.1117, longitude: -34.9097 },
            'areias': { latitude: -8.0883, longitude: -34.9097 },
            'ipsep': { latitude: -8.1072, longitude: -34.9247 },
            'barro': { latitude: -8.0858, longitude: -34.9022 },
            'cohab': { latitude: -8.1361, longitude: -34.9372 },
            'ibura': { latitude: -8.1186, longitude: -34.9472 },
            'jiquiá': { latitude: -8.0814, longitude: -34.9303 },
            'torrões': { latitude: -8.1014, longitude: -34.9453 },
            'curado': { latitude: -8.0767, longitude: -34.9758 },
            'caxangá': { latitude: -8.0517, longitude: -34.9322 },
            'jardim uchôa': { latitude: -8.0453, longitude: -34.9681 },
            'engenho do meio': { latitude: -8.0339, longitude: -34.9325 },
            'cidade universitária': { latitude: -8.0547, longitude: -34.9519 }
        };
        
        const normalizedNeighborhood = neighborhood.toLowerCase().trim();
        return neighborhoods[normalizedNeighborhood] || null;
    }
}
