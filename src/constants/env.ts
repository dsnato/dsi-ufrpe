import Constants from 'expo-constants';

// Environment types
export type Environment = 'development' | 'staging' | 'production';

// Feature flags interface
export interface FeatureFlags {
    enableDarkMode: boolean;
    enableAnalytics: boolean;
    enableCrashReporting: boolean;
    enableOfflineMode: boolean;
    enablePushNotifications: boolean;
    enableAdvancedSearch: boolean;
    enableImageCompression: boolean;
    maintenanceMode: boolean;
}

// API endpoints interface
export interface ApiEndpoints {
    supabaseUrl: string;
    supabaseKey: string;
    apiBaseUrl: string;
    apiTimeout: number;
    retryAttempts: number;
}

// App configuration interface
export interface AppConfig {
    environment: Environment;
    appName: string;
    appVersion: string;
    buildNumber: string;
    features: FeatureFlags;
    api: ApiEndpoints;
    theme: {
        primaryColor: string;
        secondaryColor: string;
    };
    logging: {
        enableConsole: boolean;
        enableRemote: boolean;
        logLevel: 'debug' | 'info' | 'warn' | 'error';
    };
    security: {
        enableSSL: boolean;
        certificatePinning: boolean;
        sessionTimeout: number;
    };
}

// Determine current environment
function getCurrentEnvironment(): Environment {
    const env = process.env.NODE_ENV || 'development';

    if (env.includes('prod')) return 'production';
    if (env.includes('staging')) return 'staging';
    return 'development';
}

// Get Supabase credentials from environment
function getSupabaseConfig(): { url: string; key: string } {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!url || !key) {
        console.warn('Supabase credentials not found in environment variables');
    }

    return { url, key };
}

// Default feature flags by environment
const featureFlagsByEnvironment: Record<Environment, FeatureFlags> = {
    development: {
        enableDarkMode: true,
        enableAnalytics: false,
        enableCrashReporting: false,
        enableOfflineMode: true,
        enablePushNotifications: false,
        enableAdvancedSearch: true,
        enableImageCompression: false,
        maintenanceMode: false,
    },
    staging: {
        enableDarkMode: true,
        enableAnalytics: true,
        enableCrashReporting: true,
        enableOfflineMode: true,
        enablePushNotifications: true,
        enableAdvancedSearch: true,
        enableImageCompression: true,
        maintenanceMode: false,
    },
    production: {
        enableDarkMode: true,
        enableAnalytics: true,
        enableCrashReporting: true,
        enableOfflineMode: false,
        enablePushNotifications: true,
        enableAdvancedSearch: true,
        enableImageCompression: true,
        maintenanceMode: false,
    },
};

// API endpoints by environment
const apiEndpointsByEnvironment: Record<Environment, ApiEndpoints> = {
    development: {
        supabaseUrl: getSupabaseConfig().url,
        supabaseKey: getSupabaseConfig().key,
        apiBaseUrl: 'http://localhost:3000',
        apiTimeout: 30000,
        retryAttempts: 3,
    },
    staging: {
        supabaseUrl: getSupabaseConfig().url,
        supabaseKey: getSupabaseConfig().key,
        apiBaseUrl: 'https://staging-api.example.com',
        apiTimeout: 30000,
        retryAttempts: 3,
    },
    production: {
        supabaseUrl: getSupabaseConfig().url,
        supabaseKey: getSupabaseConfig().key,
        apiBaseUrl: 'https://api.example.com',
        apiTimeout: 30000,
        retryAttempts: 3,
    },
};

// App configuration factory
function createAppConfig(): AppConfig {
    const environment = getCurrentEnvironment();
    const { version } = Constants.manifest2?.runtimeVersion ? { version: '1.0.0' } : Constants.manifest || { version: '1.0.0' };

    return {
        environment,
        appName: Constants.manifest2?.slug || 'dsi-ufrpe-app',
        appVersion: version || '1.0.0',
        buildNumber: Constants.manifest2?.version || '1',
        features: featureFlagsByEnvironment[environment],
        api: apiEndpointsByEnvironment[environment],
        theme: {
            primaryColor: '#007AFF',
            secondaryColor: '#5AC8FA',
        },
        logging: {
            enableConsole: environment !== 'production',
            enableRemote: environment === 'production',
            logLevel: environment === 'production' ? 'error' : 'debug',
        },
        security: {
            enableSSL: environment !== 'development',
            certificatePinning: environment === 'production',
            sessionTimeout: environment === 'production' ? 15 * 60 * 1000 : 60 * 60 * 1000, // 15 min prod, 1 hour dev
        },
    };
}

// Create singleton config instance
export const appConfig: AppConfig = createAppConfig();

// Helper functions
export function isProduction(): boolean {
    return appConfig.environment === 'production';
}

export function isDevelopment(): boolean {
    return appConfig.environment === 'development';
}

export function isStaging(): boolean {
    return appConfig.environment === 'staging';
}

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return appConfig.features[feature];
}

export function getEnvironmentValue<T>(
    development: T,
    staging: T,
    production: T
): T {
    const env = appConfig.environment;
    switch (env) {
        case 'production':
            return production;
        case 'staging':
            return staging;
        case 'development':
        default:
            return development;
    }
}

export function getApiEndpoint(path: string): string {
    const baseUrl = appConfig.api.apiBaseUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
}

// Export config for debugging
export function debugConfig(): void {
    if (isDevelopment()) {
        console.log('=== APP CONFIG ===');
        console.log(`Environment: ${appConfig.environment}`);
        console.log(`App: ${appConfig.appName} v${appConfig.appVersion}`);
        console.log(`API Base: ${appConfig.api.apiBaseUrl}`);
        console.log('Features:', appConfig.features);
        console.log('=================');
    }
}
