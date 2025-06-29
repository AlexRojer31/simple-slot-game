import { pixiPipes } from '@assetpack/core/pixi';

export default {
    entry: './raw-assets',
    output: './public/assets',
    pipes: [
        ...pixiPipes({
            resolutions: { high: 3, default: 2, low: 1 },
            manifest: {
                trimExtensions: true
            },
            texturePacker: { 
                texturePacker: { 
                    removeFileExtension: true 
                }
            }
        }),
    ],
};