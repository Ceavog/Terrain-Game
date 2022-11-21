/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, Alert} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {
  Pressable,
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';

export default function App() {
  function calculateDistance(lattitude1, longittude1, lattitude2, longittude2) {
    const toRadian = n => (n * Math.PI) / 180;
    let lat2 = lattitude2;
    let lon2 = longittude2;
    let lat1 = lattitude1;
    let lon1 = longittude1;
    let R = 6371; // km
    let x1 = lat2 - lat1;
    let dLat = toRadian(x1);
    let x2 = lon2 - lon1;
    let dLon = toRadian(x2);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadian(lat1)) *
        Math.cos(toRadian(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
  }

  let staticData = [
    {
      title: 'title1',
      coordinates: {latitude: 49.8206386, longitude: 18.9902263},
      question: 'are you happy?',
      answers: ['answer1', 'answer2', 'answer3'],
      rightAnswer: 'answer1',
      visited: false,
    },
    {
      title: 'title2',
      coordinates: {latitude: 49.9206386, longitude: 18.8902263},
      question: 'are you happy?',
      answers: ['answer1', 'answer2', 'answer3'],
      rightAnswer: 'answer1',
      visited: false,
    },
    {
      title: 'title3',
      coordinates: {latitude: 49.7206386, longitude: 18.7902263},
      question: 'are you happy?',
      answers: ['answer1', 'answer2', 'answer3'],
      rightAnswer: 'answer1',
      visited: false,
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [isArrived, setIsArrived] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [question, SetQuestion] = useState();
  const [answers, setAnswers] = useState(['', '', '']);
  const [rightAnswer, setRightAnswer] = useState();
  const [score, setScore] = useState(0);
  const apikey = '';
  const [currentIndex, setCurrentIndex] = useState();
  const [destination, SetDestination] = useState({
    latitude: 49.7999403,
    longitude: 19.0005047,
    latitudeDelta: 0.0421,
    longitudeDelta: 0.0421,
  });

  const [initialPosition, setInitialPosition] = useState({
    latitude: 49.8139724,
    longitude: 19.0408674,
    latitudeDelta: 0.0421,
    longitudeDelta: 0.0421,
  });

  const [position, setPosition] = useState({
    latitude: 49.8139724,
    longitude: 19.0408674,
    latitudeDelta: 0.0421,
    longitudeDelta: 0.0421,
  });

  function handlePressMarker(marker, index) {
    setCurrentIndex(index);
    console.log('From handlePress marker');
    setCurrentPosition();
    setShowDirections(true);
    setIsArrived(false);
    SetDestination({
      latitude: marker.coordinates.latitude,
      longitude: marker.coordinates.longitude,
      latitudeDelta: 0.0421,
      longitudeDelta: 0.0421,
    });
    SetQuestion(marker.question);
    setAnswers(marker.answers);
    setRightAnswer(marker.rightAnswer);
  }

  function displayModal(coordinates) {
    let distance = calculateDistance(
      destination.latitude,
      destination.longitude,
      coordinates.latitude,
      coordinates.longitude,
    );

    // console.log("is arived oraz distance")
    // console.log(isArrived)
    // console.log(distance)
    if (distance < 0.05 && isArrived === false) {
      console.log('display modal');
      setModalVisible(true);
      setShowDirections(false);
      setIsArrived(true);
    }
  }

  const setCurrentPosition = () => {
    Geolocation.getCurrentPosition(pos => {
      const crd = pos.coords;
      setPosition({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
    });
  };

  function computeScore(answer, correctAnswer) {
    if (answer === correctAnswer) {
      setScore(score + 1);
    }
    setModalVisible(false);
    console.log(staticData);
    staticData[currentIndex].visited = true;
    console.log(staticData);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.scoreStyle}>Score: {score} </Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{question}</Text>

            {answers.map((item, index) => (
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => computeScore(item, rightAnswer)}>
                <Text style={{color: 'black'}} key={index}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
      <View>
        <MapView
          style={styles.map}
          initialRegion={initialPosition}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsCompass={true}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
          onUserLocationChange={e => displayModal(e.nativeEvent.coordinate)}>
          {showDirections && (
            <MapViewDirections
              origin={position}
              destination={destination}
              apikey={apikey}
              onReady={e => console.log(e.distance)}
              mode={'WALKING'}
            />
          )}
          {staticData.map(
            (item, index) =>
              !item.visited && (
                <Marker
                  key={index}
                  title={item.title}
                  coordinate={item.coordinates}
                  pinColor="green"
                  onPress={() => handlePressMarker(item, index)}
                />
              ),
          )}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreStyle: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
