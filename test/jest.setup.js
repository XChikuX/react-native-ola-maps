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
        MapView: Mock('MapView'),
        Camera: Mock('Camera'),
        PointAnnotation: Mock('PointAnnotation'),
        ShapeSource: Mock('ShapeSource'),
        LineLayer: Mock('LineLayer'),
        FillLayer: Mock('FillLayer'),
        Callout: Mock('Callout'),
        UserLocation: Mock('UserLocation'),
      },
      MapView: Mock('MapView'),
      Camera: Mock('Camera'),
      PointAnnotation: Mock('PointAnnotation'),
      ShapeSource: Mock('ShapeSource'),
      LineLayer: Mock('LineLayer'),
      FillLayer: Mock('FillLayer'),
      Callout: Mock('Callout'),
      UserLocation: Mock('UserLocation'),
    };
  },
  { virtual: true }
);
