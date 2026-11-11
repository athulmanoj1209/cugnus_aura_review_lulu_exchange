import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const CygnusPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#eef5fc',
            100: '#d7eafa',
            200: '#a5d1f9',
            300: '#67b5fc',
            400: '#138cfb',
            500: '#0357a3',
            600: '#034a8b',
            700: '#023d72',
            800: '#02315b',
            900: '#012648',
            950: '#011a31'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.500}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.600}',
                    activeColor: '{primary.700}'
                },
                highlight: {
                    background: '{primary.50}',
                    focusBackground: '{primary.100}',
                    color: '{primary.700}',
                    focusColor: '{primary.800}'
                }
            },
            dark: {
                primary: {
                    color: '{primary.400}',
                    contrastColor: '{surface.900}',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                },
                highlight: {
                    background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                    focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        }
    }
});

export default CygnusPreset;
