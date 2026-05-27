/* global jest */
global.fetch = jest.fn();

jest.mock(
  'mappls-map-react-native',
  () => {
    const React = require('react');
    const Mock = (name) => {
      const Component = ({ children, ...props }, ref) =>
        React.createElement(name, { ...props, ref }, children);
      Component.displayName = name;
      return React.forwardRef(Component);
    };

    return {
      MapView: Mock('MapView'),
      Camera: Mock('Camera'),
      PointAnnotation: Mock('PointAnnotation'),
      ShapeSource: Mock('ShapeSource'),
      LineLayer: Mock('LineLayer'),
      FillLayer: Mock('FillLayer'),
      Callout: Mock('Callout'),
      UserLocation: Mock('UserLocation'),
      RestApi: {
        autoSuggest: jest.fn().mockResolvedValue({ suggestedLocations: [] }),
        geocode: jest.fn().mockResolvedValue({ results: [] }),
        reverseGeocode: jest.fn().mockResolvedValue({ results: [] }),
        placeDetail: jest.fn().mockResolvedValue({ mapplsPin: 'MMI000' }),
        nearby: jest.fn().mockResolvedValue({ suggestedLocations: [] }),
        direction: jest.fn().mockResolvedValue({ routes: [] }),
        distance: jest.fn().mockResolvedValue({ results: [] }),
        POIAlongRoute: jest.fn().mockResolvedValue({ suggestedPOIs: [] }),
      },
    };
  },
  { virtual: true }
);
