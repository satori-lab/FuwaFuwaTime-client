import * as React from "react";
import { Style } from "./style";
import { Text, View, StyleSheet, Image } from "react-native";
import { Audio } from "expo-av";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { useStopwatch, useTimer } from "react-timer-hook";
import { catImages, catShowIndexRange } from "./const";

export default function App() {
  const camera = React.useRef<Camera>(null);
  const [sound, setSound] = React.useState<Audio.Sound | undefined>(undefined);
  const { seconds, reset } = useStopwatch({ autoStart: true });
  const [firstCrying, setFirstCrying] = React.useState(true);
  const [hasPermission, setHasPermission] = React.useState<null | boolean>(
    null
  );
  const [showCat, setShowCat] = React.useState<undefined | number>(undefined);
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
      await soundSetUp.loadAsync(require("../assets/cat.mp3"));
      setSound(soundSetUp);
      setInterval(() => {
        const updateControlId = "controlId" + Math.random();
        setControlId(updateControlId);
      }, 1000);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (showCat !== undefined) {
        const updateDuration = showDuration + 1;
          setShowDuration(updateDuration);
          if (updateDuration > catImages[showCat].duration) {
            setShowCat(undefined);
            setShowDuration(0);
          }
      }
    })();
  }, [controlId]);

  React.useEffect(() => {
    if (!isCatAppearance() && !firstCrying) {
      setFirstCrying(true);
    }
    if (isCatAppearance() && showCat === undefined) {
      setShowCat(Math.floor(Math.random() * (catShowIndexRange.max + 1 - catShowIndexRange.min)) + catShowIndexRange.min);
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
      {showCat !== undefined && <Image source={catImages[showCat].resource} style={styles.image} />}
      <Text>{showCat === undefined ? "not cat" : showCat}</Text>
      <Text>{"seconds: " + seconds}</Text>
      <Text>{"showDuration: " + showDuration}</Text>
      <Text>{"controlId: " + controlId}</Text>
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
  image: {
    bottom: -50,
  }
});
