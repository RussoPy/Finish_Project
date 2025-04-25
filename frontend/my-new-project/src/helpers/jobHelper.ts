import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../api/firebase'; // Assuming db is correctly initialized

/**
 * Records a 'like' swipe from a worker for a specific job.
 * Stores the jobId in the worker's like list.
 * @param workerId - The ID of the worker performing the swipe.
 * @param jobId - The ID of the job being liked.
 */
const likeJob = async (workerId: string, jobId: string) => {
  // Reference the specific document: /workers/{workerId}/swipes/data
  const swipeDataRef = doc(db, 'workers', workerId, 'swipes', 'data');
  const docSnap = await getDoc(swipeDataRef);

  // Initialize the swipe document for the worker if it doesn't exist
  if (!docSnap.exists()) {
    try {
      await setDoc(swipeDataRef, { likes: [], dislikes: [] });
      console.log(`Initialized swipe data for worker: ${workerId}`);
    } catch (error) {
      console.error("Error initializing worker swipe data:", error);
      return; // Exit if initialization fails
    }
  }

  // Add the jobId to the 'likes' array, preventing duplicates
  try {
    await updateDoc(swipeDataRef, {
      likes: arrayUnion(jobId),
      // Optionally remove from dislikes if it exists there
      // dislikes: arrayRemove(jobId) 
    });
    console.log(`Worker ${workerId} liked job ${jobId}`);
  } catch (error) {
    console.error("Error updating worker likes:", error);
  }
};

/**
 * Records a 'dislike' swipe from a worker for a specific job.
 * Stores the jobId in the worker's dislike list.
 * @param workerId - The ID of the worker performing the swipe.
 * @param jobId - The ID of the job being disliked.
 */
const dislikeJob = async (workerId: string, jobId: string) => {
  // Reference the specific document: /workers/{workerId}/swipes/data
  const swipeDataRef = doc(db, 'workers', workerId, 'swipes', 'data');
  const docSnap = await getDoc(swipeDataRef);

  // Initialize the swipe document for the worker if it doesn't exist
  if (!docSnap.exists()) {
     try {
      await setDoc(swipeDataRef, { likes: [], dislikes: [] });
      console.log(`Initialized swipe data for worker: ${workerId}`);
    } catch (error) {
      console.error("Error initializing worker swipe data:", error);
      return; // Exit if initialization fails
    }
  }

  // Add the jobId to the 'dislikes' array, preventing duplicates
  try {
    await updateDoc(swipeDataRef, {
      dislikes: arrayUnion(jobId),
      // Optionally remove from likes if it exists there
      // likes: arrayRemove(jobId) 
    });
     console.log(`Worker ${workerId} disliked job ${jobId}`);
  } catch (error) {
     console.error("Error updating worker dislikes:", error);
  }
};

// Export the updated functions
export {likeJob, dislikeJob};