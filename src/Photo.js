import React, { useRef, useState } from 'react';
import { View, Image, Button, Text } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import Exif from 'react-native-exif';
import MapView, { Marker } from 'react-native-maps';

const photoGallery = () => {
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const sketchCanvasRef = useRef(null);

 
  const handleSelectImage = () => {
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
        }).then((image) => {
          clearCanvas()
          setImageUri(image.path);
          getImageLocation(image.path)
      });
  }

  const getImageLocation = async (imageUri) => {
    try {
      const locationData = await Exif.getLatLong(imageUri);
      console.log('Image Location: ', locationData);
      if (locationData && locationData.GPSLatitude && locationData.GPSLongitude) {
        setLocation({
          latitude: locationData.GPSLatitude,
          longitude: locationData.GPSLongitude,
        });
      } else {
        setLocation(null);
      }
    } catch (error) {
      console.log('Error getting image location: ', error);
    }
  };

  const clearCanvas = () => {
    if (sketchCanvasRef.current) {
      sketchCanvasRef.current.clear();
    }
  };

  return (
    <View>
      {imageUri && (
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: imageUri }} style={{ width: "100%", height: 400 }} />
          <SketchCanvas
            ref={sketchCanvasRef}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            strokeColor="#FF0000"
            strokeWidth={5}
            localSource={{ uri: imageUri }}
          />
        </View>
      )}
      <Button title="Select Image from Gallery" onPress={handleSelectImage} />
      <Button title="Clear Canvas" onPress={clearCanvas} />
      {imageUri && (
        <View>
          <Text>  Latitude: {location?.latitude}</Text>
          <Text>  Longitude: {location?.longitude}</Text>
        </View>
      )}
      {imageUri && (
        <MapView
          style={{ height: 250, width: "100%", marginTop: 20 }}
          initialRegion={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location?.latitude,
              longitude: location?.longitude,
            }}
          />
        </MapView>
      )} 
    </View>
  );
};

export default photoGallery;




