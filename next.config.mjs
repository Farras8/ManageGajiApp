const nextConfig = {
    images: {
        unoptimized: true,
    },
    // Untuk Netlify, gunakan output standalone atau hapus jika ingin SSR
    // output: 'standalone', // Uncomment untuk SSR
    eslint: {
        ignoreDuringBuilds: true, // Optional: skip ESLint saat build
    },
    typescript: {
        ignoreBuildErrors: false, // Set true jika ada error TypeScript
    },
}

export default nextConfig
