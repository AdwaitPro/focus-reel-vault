import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.49e269b6bd1542419116b834251b2c58',
  appName: 'FocusReels - Personal Motivation Hub',
  webDir: 'dist',
  server: {
    url: "https://49e269b6-bd15-4241-9116-b834251b2c58.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    Filesystem: {
      iosDatabaseLocation: 'Documents'
    }
  }
};

export default config;