import { StyleSheet } from 'react-native';

// Common padding and margins
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
} as const;

// Common border radius values
export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 20,
} as const;

// Common font sizes
export const fontSize = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
} as const;

// Common font weights
export const fontWeight = {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
} as const;

// Shadow utilities
export const shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
} as const;

// Common opacity values
export const opacity = {
    disabled: 0.5,
    hover: 0.7,
    active: 0.9,
    full: 1,
} as const;

// Create centered flex container
export const centerFlex = {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
};

// Create flex row
export const flexRow = {
    flexDirection: 'row' as const,
};

// Create flex column (default)
export const flexColumn = {
    flexDirection: 'column' as const,
};

// Create responsive container
export const container = {
    flex: 1,
    padding: spacing.lg,
};

// Create card style
export const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
};
