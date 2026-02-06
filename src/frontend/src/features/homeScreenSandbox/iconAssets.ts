export interface IconAsset {
  id: string;
  label: string;
  path: string;
}

export const iconAssets: IconAsset[] = [
  {
    id: 'camera',
    label: 'Camera',
    path: '/assets/generated/icon-camera.dim_256x256.png',
  },
  {
    id: 'music',
    label: 'Music',
    path: '/assets/generated/icon-music.dim_256x256.png',
  },
  {
    id: 'chat',
    label: 'Chat',
    path: '/assets/generated/icon-chat.dim_256x256.png',
  },
  {
    id: 'map',
    label: 'Map',
    path: '/assets/generated/icon-map.dim_256x256.png',
  },
  {
    id: 'game',
    label: 'Game',
    path: '/assets/generated/icon-game.dim_256x256.png',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/assets/generated/icon-settings.dim_256x256.png',
  },
];
