import * as React from "react";
import { Style } from "./style";
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { Audio } from "expo-av";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { useStopwatch, useTimer } from "react-timer-hook";
import { images, showIndexRanges, animals, voices } from "./const";
import Select from "./select";
import { SelectModal } from "./modal";

export default function App() {
  const camera = React.useRef<Camera>(null);
  const [sound, setSound] = React.useState<Audio.Sound | undefined>(undefined);
  const { seconds, reset } = useStopwatch({ autoStart: true });
  const [firstCrying, setFirstCrying] = React.useState(true);
  const [tap, setTapped] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [animalType, setAnimalType] = React.useState(animals['cat']);
  const [hasPermission, setHasPermission] = React.useState<null | boolean>(
    null
  );
  const [showAnimal, setShowAnimal] = React.useState<undefined | number>(undefined);
  const [showDuration, setShowDuration] = React.useState(0);
  const [controlId, setControlId] = React.useState("");

  const onFacesDetected = () => {
    reset();
  };

  const isCatAppearance = (): boolean => seconds > 3;

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
      const soundSetUp = new Audio.Sound();
      await soundSetUp.loadAsync(voices.cat);
      setSound(soundSetUp);
      setInterval(() => {
        const updateControlId = "controlId" + Math.random();
        setControlId(updateControlId);
      }, 1000);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (showAnimal !== undefined) {
        const updateDuration = showDuration + 1;
        setShowDuration(updateDuration);
        if (updateDuration > images[animalType][showAnimal].duration) {
          setShowAnimal(undefined);
          setShowDuration(0);
        }
      }
    })();
  }, [controlId]);

  React.useEffect(() => {
    if (!isCatAppearance() && !firstCrying) {
      setFirstCrying(true);
    }
    if (isCatAppearance() && showAnimal === undefined) {
      setShowAnimal(Math.floor(Math.random() * (showIndexRanges[animalType].max + 1 - showIndexRanges[animalType].min)) + showIndexRanges[animalType].min);
    }
    if (sound !== undefined && isCatAppearance()) {
      (async () => {
        const soundStatus = await sound.getStatusAsync();
        if (soundStatus.isLoaded && !soundStatus.isPlaying && firstCrying) {
          try {
            const soundSetUp = new Audio.Sound();
            await soundSetUp.loadAsync(voices[animalType]);
            setSound(soundSetUp);
            setFirstCrying(false);
            sound.replayAsync();
          } catch (error) {
            console.log(error);
          }
        }
      })();
    }
  }, [seconds]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    < Camera
      onFacesDetected={onFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.Constants.Mode.fast,
        detectLandmarks: FaceDetector.Constants.Landmarks.none,
        runClassifications: FaceDetector.Constants.Classifications.none,
        minDetectionInterval: 100,
        tracking: true,
      }}
      style={Style.camera}
      type={Camera.Constants.Type.front}
      ref={camera}
    >
      < TouchableOpacity onPress={() => {
        setTapped(!tap)
      }}>
        {showAnimal !== undefined && <Image source={images[animalType][showAnimal]?.resource} style={styles.image} />}

        {tap ? <Select setModalVisible={setModalVisible} /> : null}
        {modalVisible ? <SelectModal modalVisible={modalVisible} setModalVisible={setModalVisible} setAnimalType={setAnimalType} /> : null}
      </TouchableOpacity >
    </Camera >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    bottom: -50,
  }
});
