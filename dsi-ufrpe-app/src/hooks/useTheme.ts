import { supabase } from '@/lib/supabase';
import { colorPalettes, type ColorPalette, type ThemeMode } from '@/src/constants/themes';
import { useCallback, useMemo, useState } from 'react';

export function useTheme() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const loadThemePreference = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const preferredTheme = user.user_metadata?.preferred_theme;
            setIsDarkMode(preferredTheme === 'dark');
        } catch (error) {
            console.error('Erro ao carregar preferência de tema:', error);
        }
    }, []);

    const theme: ColorPalette = useMemo(
        () => (isDarkMode ? colorPalettes.dark : colorPalettes.light),
        [isDarkMode]
    );

    const themeMode: ThemeMode = isDarkMode ? 'dark' : 'light';

    return {
        isDarkMode,
        setIsDarkMode,
        theme,
        themeMode,
        loadThemePreference,
    };
}
