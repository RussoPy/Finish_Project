import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../api/firebase'; // ✅ adjust this to your Firebase config file
import { Job } from '../models/jobModel'; // ✅ adjust to your actual model path
import SwipeableCardStack from './SwipeableCardStack'; // ✅ adjust path if needed
import {likeJob, dislikeJob} from '../helpers/jobHelper'; // ✅ adjust this import to your Firebase config file

export default function JobMatchScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const userId: string | undefined = auth.currentUser?.uid;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('[JobMatchScreen] 🔄 Fetching jobs...');
        const snapshot = await getDocs(collection(db, 'jobs'));

        const fetchedJobs: Job[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            business_id: data.business_id ?? '',
            title: data.title ?? '',
            description: data.description ?? '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            experience_required: data.experience_required ?? '',
            skills_needed: Array.isArray(data.skills_needed) ? data.skills_needed : [],
            location_lat: data.location_lat ?? 0,
            location_lng: data.location_lng ?? 0,
            salary_min: data.salary_min ?? 0,
            salary_max: data.salary_max ?? 0,
            is_active: data.is_active ?? true,
            applicants: Array.isArray(data.applicants) ? data.applicants : [],
            matches: Array.isArray(data.matches) ? data.matches : [],
            rejected: typeof data.rejected === 'object' && data.rejected !== null ? data.rejected : {},
            created_at: data.created_at ?? null,
            imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
            industry: data.industry ?? '', 
          };
        }).filter(job => job.is_active);

        console.log('[JobMatchScreen] ✅ Loaded jobs:', fetchedJobs.map(j => j.title));
        setJobs(fetchedJobs);
      } catch (error) {
        console.error('[JobMatchScreen] ❌ Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={{ marginTop: 10 }}>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {jobs.length > 0 ? (
      <SwipeableCardStack
        jobs={jobs}
        onSwipeRight={(job: Job) => {
        if (!userId) return;
        console.log('👉 Liked:', job.title);
        likeJob(userId, job.id);
        }}
        onSwipeLeft={(job: Job) => {
        if (!userId) return;
        console.log('👈 Disliked:', job.title);
        dislikeJob(userId, job.id);
        }}
      />
      ) : (
      <Text style={{ textAlign: 'center', marginTop: 100 }}>🎉 No jobs available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0EC',
    paddingTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
