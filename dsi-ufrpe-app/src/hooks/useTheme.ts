import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { colorPalettes } from '../constants/themes';

export function useTheme() {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(systemColorScheme === 'dark' ? 'dark' : 'light');

    const theme = isDarkMode ? colorPalettes.dark : colorPalettes.light;

    const loadThemePreference = async () => {
        try {
            // Aqui você pode carregar a preferência de tema do Supabase ou AsyncStorage
        } catch (error) {
            console.error('Error loading theme preference:', error);
        }
    };

    useEffect(() => {
        loadThemePreference();
    }, []);

    return {
        isDarkMode,
        setIsDarkMode,
        theme,
        themeMode,
        setThemeMode,
        loadThemePreference,
    };
}
