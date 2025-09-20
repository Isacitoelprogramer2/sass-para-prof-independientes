/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ["@untitledui/icons"],
    },
    // Configuración para Firebase Hosting con Next.js dinámico
    // output: 'export', // Removido para permitir SSR/ISR
    // trailingSlash: true, // No necesario para dinámico
    // skipTrailingSlashRedirect: true, // No necesario para dinámico
    // distDir: 'out', // Usar default 'dist' o dejar automático
    images: {
        // unoptimized: true, // Removido, usar optimización normal
    },
};

export default nextConfig;
