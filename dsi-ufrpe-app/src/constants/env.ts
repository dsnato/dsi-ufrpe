import Constants from 'expo-constants';

export type Environment = 'development' | 'staging' | 'production';

export interface FeatureFlags {
    enableDarkMode: boolean;
    enableAnalytics: boolean;
    enableOfflineMode: boolean;
    maintenanceMode: boolean;
}

export interface ApiEndpoints {
    supabaseUrl: string;
    supabaseKey: string;
    apiBaseUrl: string;
    apiTimeout: number;
}

export interface AppConfig {
    environment: Environment;
    appName: string;
    appVersion: string;
    features: FeatureFlags;
    api: ApiEndpoints;
}

function getCurrentEnvironment(): Environment {
    const env = process.env.NODE_ENV || 'development';
    if (env.includes('prod')) return 'production';
    if (env.includes('staging')) return 'staging';
    return 'development';
}

function getSupabaseConfig(): { url: string; key: string } {
    return {
        url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
        key: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    };
}

const featureFlagsByEnvironment: Record<Environment, FeatureFlags> = {
    development: {
        enableDarkMode: true,
        enableAnalytics: false,
        enableOfflineMode: true,
        maintenanceMode: false,
    },
    staging: {
        enableDarkMode: true,
        enableAnalytics: true,
        enableOfflineMode: true,
        maintenanceMode: false,
    },
    production: {
        enableDarkMode: true,
        enableAnalytics: true,
        enableOfflineMode: false,
        maintenanceMode: false,
    },
};

const apiEndpointsByEnvironment: Record<Environment, ApiEndpoints> = {
    development: {
        supabaseUrl: getSupabaseConfig().url,
        supabaseKey: getSupabaseConfig().key,
        apiBaseUrl: 'http://localhost:3000',
        apiTimeout: 30000,
    },
    staging: {
        supabaseUrl: getSupabaseConfig().url,
        supabaseKey: getSupabaseConfig().key,
        apiBaseUrl: 'https://staging-api.example.com',
        apiTimeout: 30000,
    },
    production: {
        supabaseUrl: getSupabaseConfig().url,
        supabaseKey: getSupabaseConfig().key,
        apiBaseUrl: 'https://api.example.com',
        apiTimeout: 30000,
    },
};

function createAppConfig(): AppConfig {
    const environment = getCurrentEnvironment();
    return {
        environment,
        appName: Constants.manifest2?.slug || 'dsi-ufrpe-app',
        appVersion: '1.0.0',
        features: featureFlagsByEnvironment[environment],
        api: apiEndpointsByEnvironment[environment],
    };
}

export const appConfig: AppConfig = createAppConfig();

export function isProduction(): boolean {
    return appConfig.environment === 'production';
}

export function isDevelopment(): boolean {
    return appConfig.environment === 'development';
}

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return appConfig.features[feature];
}
