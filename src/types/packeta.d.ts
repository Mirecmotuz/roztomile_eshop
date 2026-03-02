interface PacketaPoint {
  id: string;
  name: string;
  nameStreet: string;
  city: string;
  zip: string;
  country: string;
}

interface PacketaWidgetOptions {
  webUrl: string;
  appIdentity: string;
  language: string;
  country: string;
}

interface PacketaWidget {
  pick: (
    apiKey: string,
    callback: (point: PacketaPoint | null) => void,
    options?: Partial<PacketaWidgetOptions>,
    element?: HTMLElement | string | null
  ) => void;
}

interface PacketaNamespace {
  Widget: PacketaWidget;
}

declare global {
  interface Window {
    Packeta?: PacketaNamespace;
  }
}

export {};
