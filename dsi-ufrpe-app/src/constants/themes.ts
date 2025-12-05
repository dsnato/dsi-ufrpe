// Color palettes for light and dark modes
export const colorPalettes = {
    light: {
        background: '#132F3B',
        content: '#F8FAFC',
        card: '#FFFFFF',
        text: '#132F3B',
        textSecondary: '#64748B',
        muted: '#94A3B8',
        accent: '#0162B3',
        border: '#E2E8F0',
        switchTrack: '#CBD5E1',
        switchThumb: '#FFFFFF',
        breadcrumb: '#E0F2FE',
        icon: '#0162B3',
        backIcon: '#FFFFFF',
    },
    dark: {
        background: '#050C18',
        content: '#0B1624',
        card: '#152238',
        text: '#E2E8F0',
        textSecondary: '#CBD5E1',
        muted: '#94A3B8',
        accent: '#4F9CF9',
        border: '#1F2B3C',
        switchTrack: '#1F2B3C',
        switchThumb: '#CBD5E1',
        breadcrumb: '#94A3B8',
        icon: '#60A5FA',
        backIcon: '#FACC15',
    },
} as const;

export type ColorPalette = typeof colorPalettes.light;
export type ThemeMode = 'light' | 'dark';
