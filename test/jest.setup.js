/* global jest */
global.fetch = jest.fn();

jest.mock(
  '@maplibre/maplibre-react-native',
  () => {
    const React = require('react');
    const Mock = (name) => {
      const Component = ({ children, ...props }, ref) =>
        React.createElement(name, { ...props, ref }, children);
      Component.displayName = name;
      return React.forwardRef(Component);
    };

    return {
      __esModule: true,
      default: {
        Map: Mock('Map'),
        Camera: Mock('Camera'),
        Marker: Mock('Marker'),
        GeoJSONSource: Mock('GeoJSONSource'),
        Layer: Mock('Layer'),
        Callout: Mock('Callout'),
        UserLocation: Mock('UserLocation'),
        NativeUserLocation: Mock('NativeUserLocation'),
      },
      Map: Mock('Map'),
      Camera: Mock('Camera'),
      Marker: Mock('Marker'),
      GeoJSONSource: Mock('GeoJSONSource'),
      Layer: Mock('Layer'),
      Callout: Mock('Callout'),
      UserLocation: Mock('UserLocation'),
      NativeUserLocation: Mock('NativeUserLocation'),
    };
  },
  { virtual: true }
);
