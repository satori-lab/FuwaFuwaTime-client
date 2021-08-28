import * as React from "react";
import { Style } from "./style";
import { Text, View, StyleSheet, Image } from "react-native";
import { Audio } from "expo-av";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { useStopwatch, useTimer } from "react-timer-hook";

export default function App() {
  const camera = React.useRef<Camera>(null);
  const [sound, setSound] = React.useState<Audio.Sound | undefined>(undefined);
  const { seconds, reset } = useStopwatch({ autoStart: true });
  const [firstCrying, setFirstCrying] = React.useState(true);
  const [hasPermission, setHasPermission] = React.useState<null | boolean>(
    null
  );

  const onFacesDetected = () => {
    reset();
  };

  const isCatAppearance = (): boolean => seconds > 3;

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
      const soundSetUp = new Audio.Sound();
          await soundSetUp.loadAsync(require("../assets/cat1b.mp3"));
          setSound(soundSetUp);
    })();
  }, []);

  React.useEffect(() => {
    if (!isCatAppearance() && !firstCrying) {
      setFirstCrying(true);
    }
    if (sound !== undefined && isCatAppearance()) {
      (async () => {
        const soundStatus = await sound.getStatusAsync();
        if (soundStatus.isLoaded && !soundStatus.isPlaying && firstCrying) {
          try {
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
    <Camera
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
      {isCatAppearance() && <Image source={require("../assets/cat_1.gif")} />}
    </Camera>
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
});
