import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface MapEmbedProps {
    latitude: number;
    longitude: number;
    hotelName: string;
    address: string;
    city: string;
    state: string;
}

export const MapEmbed: React.FC<MapEmbedProps> = ({
    latitude,
    longitude,
    hotelName,
    address,
    city,
    state,
}) => {
    if (Platform.OS === 'web') {
        // Para web, renderizar iframe diretamente via dangerouslySetInnerHTML
        const iframeHtml = `
            <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${latitude},${longitude}&zoom=16"
                style="width: 100%; height: 100%; border: 0;"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
        `;

        return (
            <div
                style={{ width: '100%', height: '100%' }}
                dangerouslySetInnerHTML={{ __html: iframeHtml }}
            />
        );
    }

    // Para mobile, usar WebView
    const mapHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { overflow: hidden; }
                #map { height: 100vh; width: 100vw; }
            </style>
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"></script>
        </head>
        <body>
            <div id="map"></div>
            <script>
                function initMap() {
                    const hotelLocation = { lat: ${latitude}, lng: ${longitude} };
                    
                    const map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 16,
                        center: hotelLocation,
                        disableDefaultUI: false,
                        zoomControl: true,
                        mapTypeControl: false,
                        scaleControl: true,
                        streetViewControl: false,
                        rotateControl: false,
                        fullscreenControl: true,
                    });
                    
                    const marker = new google.maps.Marker({
                        position: hotelLocation,
                        map: map,
                        title: '${hotelName}',
                        animation: google.maps.Animation.DROP,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 12,
                            fillColor: '#0162B3',
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 3
                        }
                    });
                    
                    const infoWindow = new google.maps.InfoWindow({
                        content: '<div style="padding: 10px; font-family: Arial, sans-serif;"><h3 style="margin: 0 0 8px 0; color: #0162B3; font-size: 16px;">${hotelName}</h3><p style="margin: 0; color: #64748B; font-size: 14px;">${address}</p><p style="margin: 4px 0 0 0; color: #94A3B8; font-size: 12px;">${city} - ${state}</p></div>'
                    });
                    
                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                    
                    setTimeout(() => {
                        infoWindow.open(map, marker);
                    }, 500);
                }
                
                initMap();
            </script>
        </body>
        </html>
    `;

    return (
        <WebView
            source={{ html: mapHtml }}
            style={styles.map}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
        />
    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});
