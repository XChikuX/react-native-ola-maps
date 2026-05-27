import TestRenderer, { act } from 'react-test-renderer';
import {
  IndiaMapsProvider,
  MapView,
  Marker,
  Polyline,
  Polygon,
} from '../index';

describe('React components', () => {
  it('renders MapView with MapLibre', () => {
    let renderer: TestRenderer.ReactTestRenderer | undefined;

    act(() => {
      renderer = TestRenderer.create(
        <IndiaMapsProvider accessToken="test-token">
          <MapView
            initialRegion={{ latitude: 12.9, longitude: 77.6, zoomLevel: 12 }}
          />
        </IndiaMapsProvider>
      );
    });

    expect(
      renderer?.root.findAll((node) => String(node.type) === 'Map')
    ).toHaveLength(1);
  });

  it('renders marker and geometry overlays', () => {
    let renderer: TestRenderer.ReactTestRenderer | undefined;

    act(() => {
      renderer = TestRenderer.create(
        <IndiaMapsProvider accessToken="test-token">
          <MapView>
            <Marker coordinate={{ latitude: 12.9, longitude: 77.6 }} />
            <Polyline
              coordinates={[
                [77.6, 12.9],
                [77.7, 13],
              ]}
            />
            <Polygon
              coordinates={[
                [77.6, 12.9],
                [77.7, 13],
                [77.6, 13],
              ]}
            />
          </MapView>
        </IndiaMapsProvider>
      );
    });

    expect(
      renderer?.root.findAll((node) => String(node.type) === 'GeoJSONSource')
    ).toHaveLength(2);
    expect(
      renderer?.root.findAll((node) => String(node.type) === 'Layer')
    ).toHaveLength(3);
  });
});
