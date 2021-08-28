import * as React from "react";
import { Style } from "./style";
import { Text, View, StyleSheet, Button, Image } from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";

export default function App() {
  const video = React.useRef(null);
  const camera = React.useRef<Camera>(null);
  const [status, setStatus] = React.useState({});
  const [hasPermission, setHasPermission] = React.useState<null | boolean>(
    null
  );
  const [annotationLabelText, setAnnotationLabelText] = React.useState<string>(
    ""
  );

  const onFacesDetected = () => {
    console.log("detected");
  };

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

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
      <Image source={require("../assets/cat_motion_1.gif")} />
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
