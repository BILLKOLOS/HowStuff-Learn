interface CryptoConfig {
    readonly ENCRYPTION_KEY: string;
}


const devConfig: CryptoConfig = {
    ENCRYPTION_KEY: 'encryption_key_dev',
} as const;

const prodConfig: CryptoConfig = {
    ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY_NAME || 'encryption_key_prod',
} as const;

export const cryptoConfig: Readonly<CryptoConfig> =
    import.meta.env.PROD ? prodConfig : devConfig;
export function validateConfig(config: CryptoConfig): void {
    const requiredFields: (keyof CryptoConfig)[] = [
        'ENCRYPTION_KEY',
    ];

    for (const field of requiredFields) {
        if (config[field] === undefined || config[field] === null) {
            throw new Error(`Missing required crypto configuration: ${field}`);
        }
    }
}
