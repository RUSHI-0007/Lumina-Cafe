import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Lumina Café',
        short_name: 'Lumina',
        description: 'Artisanal Coffee Experience. Order ahead and reserve tasting rooms.',
        start_url: '/',
        display: 'standalone',
        background_color: '#F4F1ED', // matches bg-cream
        theme_color: '#DFD6CB', // matches text-cream/dark context
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
