import TestRenderer, { act } from 'react-test-renderer';
import { TransformRequestManager } from '@maplibre/maplibre-react-native';
import { MapView, Marker, OlaMapsProvider, Polyline, Polygon } from '../index';

describe('React components', () => {
  it('renders MapView with provider API key and registers MapLibre transform', () => {
    let renderer: TestRenderer.ReactTestRenderer | undefined;

    act(() => {
      renderer = TestRenderer.create(
        <OlaMapsProvider apiKey="test-key">
          <MapView
            initialRegion={{ latitude: 12.9, longitude: 77.6, zoomLevel: 12 }}
          />
        </OlaMapsProvider>
      );
    });

    expect(
      renderer?.root.findAll((node) => String(node.type) === 'Map')
    ).toHaveLength(1);
    expect(TransformRequestManager.addUrlSearchParam).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'api_key', value: 'test-key' })
    );
  });

  it('renders marker and geometry overlays', () => {
    let renderer: TestRenderer.ReactTestRenderer | undefined;

    act(() => {
      renderer = TestRenderer.create(
        <OlaMapsProvider apiKey="test-key">
          <MapView>
            <Marker coordinate={{ latitude: 12.9, longitude: 77.6 }}>
              <></>
            </Marker>
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
        </OlaMapsProvider>
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
