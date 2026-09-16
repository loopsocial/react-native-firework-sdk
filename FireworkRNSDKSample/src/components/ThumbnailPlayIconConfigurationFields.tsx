import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ButtonGroup, Input } from 'react-native-elements';

export interface ThumbnailPlayIconAppearance {
  iconWidth?: number;
  imageName?: string;
  systemImageName?: string;
}

interface ThumbnailPlayIconConfigurationFieldsProps {
  value?: ThumbnailPlayIconAppearance;
  defaultSize: number;
  onChange: (value: ThumbnailPlayIconAppearance) => void;
}

interface DimensionInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

// 0 is allowed so the icon can be sized away entirely while testing.
const minimumIconSize = 0;
const maximumIconSize = 100;

const DimensionInput = ({ label, value, onChange }: DimensionInputProps) => {
  const [text, setText] = useState(value.toString());
  const parsedValue = Number(text);
  const isValid =
    text.length > 0 &&
    Number.isFinite(parsedValue) &&
    parsedValue >= minimumIconSize &&
    parsedValue <= maximumIconSize;

  useEffect(() => setText(value.toString()), [value]);

  return (
    <Input
      label={label}
      value={text}
      keyboardType="decimal-pad"
      errorMessage={
        isValid
          ? undefined
          : `Enter a value from ${minimumIconSize} to ${maximumIconSize}`
      }
      onChangeText={(nextText) => {
        setText(nextText);
        const nextValue = Number(nextText);
        if (
          nextText.length > 0 &&
          Number.isFinite(nextValue) &&
          nextValue >= minimumIconSize &&
          nextValue <= maximumIconSize
        ) {
          onChange(nextValue);
        }
      }}
      onBlur={() => {
        if (!isValid) {
          setText(value.toString());
        }
      }}
      autoComplete={undefined}
    />
  );
};

const isIOS = Platform.OS === 'ios';

const imageOptions: Array<{
  label: string;
  imageName?: string;
  systemImageName?: string;
}> = [
  { label: 'Default' },
  { label: 'Asset', imageName: 'custom_play' },
  // System images are an iOS-only concept; Android only takes a bundled drawable.
  ...(isIOS
    ? [
        { label: 'Circle', systemImageName: 'play.circle.fill' },
        { label: 'Square', systemImageName: 'play.square.fill' },
        { label: 'Rectangle', systemImageName: 'play.rectangle.fill' },
      ]
    : []),
];

const selectedImageIndex = (value?: ThumbnailPlayIconAppearance) => {
  const index = imageOptions.findIndex(
    (option) =>
      option.imageName === value?.imageName &&
      option.systemImageName === value?.systemImageName
  );
  return Math.max(index, 0);
};

const ThumbnailPlayIconConfigurationFields = ({
  value,
  defaultSize,
  onChange,
}: ThumbnailPlayIconConfigurationFieldsProps) => {
  const width = value?.iconWidth ?? defaultSize;
  const valueRef = useRef(value);
  valueRef.current = value;

  const updateWidth = (nextWidth: number) => {
    onChange({ ...valueRef.current, iconWidth: nextWidth });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Play Icon Display</Text>
      <ButtonGroup
        buttons={imageOptions.map(({ label }) => label)}
        selectedIndex={selectedImageIndex(value)}
        onPress={(index) => {
          const option = imageOptions[index];
          onChange({
            ...value,
            imageName: option?.imageName,
            systemImageName: option?.systemImageName,
          });
        }}
      />
      <DimensionInput label="Width" value={width} onChange={updateWidth} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  title: {
    color: '#86939e',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginBottom: 4,
  },
});

export default ThumbnailPlayIconConfigurationFields;
