import * as React from "react";
import { Style } from "./style";
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, Button } from "react-native";
import { Audio } from "expo-av";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { useStopwatch, useTimer } from "react-timer-hook";
import { catImages, catShowIndexRange, recordingOptions } from "./const";
import Select from "./select";
import { SelectModal } from "./modal";
import * as FileSystem from 'expo-file-system';

export default function App() {
  const camera = React.useRef<Camera>(null);
  const [sound, setSound] = React.useState<Audio.Sound | undefined>(undefined);
  const { seconds, reset } = useStopwatch({ autoStart: true });
  const [firstCrying, setFirstCrying] = React.useState(true);
  const [tap, setTapped] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [hasPermission, setHasPermission] = React.useState<null | boolean>(
    null
  );
  const [showCat, setShowCat] = React.useState<undefined | number>(undefined);
  const [showDuration, setShowDuration] = React.useState(0);
  const [controlId, setControlId] = React.useState("");
  const [hasRecodingPermission, setRecodingPermission] =  React.useState<null | boolean>(
    null
  );
  const [recording, setRecording] = React.useState<Audio.Recording | undefined>(undefined);
  const [debugUriText, setDebugUriText] = React.useState("");

  const onFacesDetected = () => {
    reset();
  };

  const isCatAppearance = (): boolean => seconds > 3;

  const startRecording = async (): Promise<void> => {
    if (!hasRecodingPermission) {
      return;
    }
    try {
      console.log('Requesting permissions..');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: true,
      }); 
      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  const stopRecording = async (): Promise<void> => {
    if (!hasPermission) {
      return;
    }
    if (recording !== undefined) {
      console.log('Stopping recording..');
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      const dataUri = recording.getURI(); 
      console.log('Recording stopped and stored at', dataUri);
      setDebugUriText(dataUri ? dataUri : "");
      if (dataUri === null) {
        return;
      }
      try {
        const info = await FileSystem.getInfoAsync(dataUri);
        console.log(`FILE INFO: ${JSON.stringify(info)}`);
        const uri = info.uri;
        const audioResponse = await fetch(uri);
        const formData = new FormData();
        // 本来であればBlobをアップロードすべきなのだが, uriを指定しないとなぜか動かないのでts-ignoreで実装する
        formData.append('file', {
          // @ts-ignore
          uri: audioResponse.url,
          type: 'audio/x-wav',
          // could be anything 
          name: 'speech2text'
        });
        const response = await fetch("https://spajam-2021-cat-4pfxmlqsaa-an.a.run.app", {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        setDebugUriText(JSON.stringify(data));
      } catch(error) {
        console.log('There was an error', error);
      }
    }
  }

  React.useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestPermissionsAsync();
      setHasPermission(cameraPermission.status === "granted");
      const recodingPermission = await Audio.requestPermissionsAsync();
      setRecodingPermission(recodingPermission.status === "granted");
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
      {showCat !== undefined && <Image source={catImages[showCat].resource} style={styles.image} />}
      < TouchableOpacity onPress={() => {
        setTapped(!tap)
      }}>

        {isCatAppearance() && <Image source={require("../assets/cat_1.gif")} style={styles.image} />}
        {tap ? <Select setModalVisible={setModalVisible} /> : null}
        {/* {modalVisible ? <SelectModal modalVisible={modalVisible} setModalVisible={setModalVisible} /> : null} */}
        {modalVisible ? <SelectModal modalVisible={modalVisible} setModalVisible={setModalVisible} /> : null}
        {/* <SelectModal modalVisible={modalVisible} setModalVisible={setModalVisible} /> */}
      </TouchableOpacity >
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Text>{debugUriText}</Text>
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
