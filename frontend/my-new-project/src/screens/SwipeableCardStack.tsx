// ✅ SwipeableCardStack.tsx — now using persistent Card component
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from './Card'; // ✅ Import the new Card component

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SwipeableCardStack({ jobs, onSwipeLeft, onSwipeRight }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const currentJob = jobs[currentIndex];
  const nextJob = jobs[currentIndex + 1];

  if (!currentJob) {
    return (
      <View style={styles.container}>
        <Text style={styles.noJobsText}>🎉 No more jobs!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {nextJob && (
        <Card job={nextJob} isTop={false} />
      )}

      <Card
        key={currentJob.id} 
        job={currentJob}
        isTop={true}
        onSwipeLeft={(job: any) => {
          onSwipeLeft(job);
        //   nextCard();
        }}
        onSwipeRight={(job: any) => {
          onSwipeRight(job);
        //   nextCard();
        }}
        onAfterSwipe={() => nextCard()}
      />

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => {
            onSwipeLeft(currentJob);
            nextCard();
          }}
          style={[styles.actionBtn, styles.rejectBtn]}
        >
          <Feather name="x" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onSwipeRight(currentJob);
            nextCard();
          }}
          style={[styles.actionBtn, styles.likeBtn]}
        >
          <Feather name="heart" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
    backgroundColor: '#fff6f3',
  },
  buttons: {
    flexDirection: 'row',
    gap: 30,
    position: 'absolute',
    bottom: 30,
    zIndex: 2,
  },
  actionBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeBtn: {
    backgroundColor: '#4cd964',
  },
  rejectBtn: {
    backgroundColor: '#ff3b30',
  },
  noJobsText: {
    fontSize: 18,
    color: '#999',
  },
});