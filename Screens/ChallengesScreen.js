import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList, TextInput } from 'react-native';
import { getFirestore, collection, doc, deleteDoc, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { auth, firestore } from '../firebase';

const ChallengesScreen = () => {
  const [challenges, setChallenges] = useState([]);
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [newChallengeDescription, setNewChallengeDescription] = useState('');
  const db = getFirestore();

  useEffect(() => {
    const fetchChallenges = async () => {
      const challengesCollection = collection(db, 'challenges');
      const challengesSnapshot = await getDocs(challengesCollection);
      const challengesData = challengesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChallenges(challengesData);
    };

    fetchChallenges();
  }, [db]);

  const handleAddChallenge = async () => {
    const newChallenge = { title: newChallengeTitle, description: newChallengeDescription };
    const challengesCollection = collection(db, 'challenges');
    const newChallengeDoc = await addDoc(challengesCollection, newChallenge);
    setChallenges(prevChallenges => [...prevChallenges, { id: newChallengeDoc.id, ...newChallenge }]);
    setNewChallengeTitle('');
    setNewChallengeDescription('');
  };

  const handleDeleteChallenge = async (challengeId) => {
    await deleteDoc(doc(db, 'challenges', challengeId));
    setChallenges(prevChallenges => prevChallenges.filter(challenge => challenge.id !== challengeId));
  };

  return (
    <View>
      <Text>Challenges</Text>
      <TextInput
        placeholder="Enter Challenge Title"
        value={newChallengeTitle}
        onChangeText={text => setNewChallengeTitle(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Challenge Description"
        value={newChallengeDescription}
        onChangeText={text => setNewChallengeDescription(text)}
        style={styles.input}
      />
      <Button title="Add Challenge" onPress={handleAddChallenge} />
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Button title="Delete" onPress={() => handleDeleteChallenge(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ChallengesScreen;
