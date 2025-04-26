// src/screens/editors/jobeditors/EditImages.tsx

import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import spacing from '../../../styles/spacing';
import colors from '../../../styles/colors';

export default function EditImages() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { currentImages = [], onSave } = route.params || {};

  const [images, setImages] = useState<string[]>(currentImages);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled && result.assets) {
      const selected = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...selected]);
    }
  };

  const handleSave = () => {
    onSave(images);
    navigation.goBack();
  };

  const handleRemoveImage = (uri: string) => {
    setImages(prev => prev.filter(img => img !== uri));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2', padding: spacing.l }}>
      <Text style={{
        fontSize: 22,
        textAlign: 'center',
        marginBottom: spacing.xl,
        fontFamily: 'PoetsenOne_400Regular',
        color: '#333',
      }}>
        Upload Company Images
      </Text>

      <Button
        mode="contained"
        onPress={pickImage}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 20,
          alignSelf: 'center',
          marginBottom: spacing.l,
          elevation: 8,
        }}
        contentStyle={{ paddingVertical: 10, paddingHorizontal: 16 }}
        labelStyle={{
          fontFamily: 'RobotoMono_400Regular',
          fontWeight: '600',
          fontSize: 16,
          color: 'white',
        }}
      >
        Pick Images
      </Button>

      <ScrollView contentContainerStyle={{ paddingTop: spacing.l }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {images.map((uri) => (
            <TouchableOpacity
              key={uri}
              onPress={() => handleRemoveImage(uri)}
              style={{ margin: spacing.s }}
            >
              <Image
                source={{ uri }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.muted,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={{ padding: spacing.l }}>
        <Button
          mode="contained"
          onPress={handleSave}
          disabled={images.length === 0}
          style={{
            backgroundColor: images.length > 0 ? colors.primary : colors.muted,
            borderRadius: 20,
            alignSelf: 'center',
            paddingHorizontal: 32,
            elevation: 8,
          }}
          contentStyle={{ paddingVertical: 10 }}
          labelStyle={{
            fontFamily: 'RobotoMono_400Regular',
            fontWeight: '600',
            fontSize: 16,
            color: 'white',
          }}
        >
          Save Images
        </Button>
      </View>
    </View>
  );
}
