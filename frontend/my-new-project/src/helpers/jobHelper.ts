import { doc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from '../api/firebase'; // Adjust this import to your Firebase config file

const likeJob = async (userId: string, jobId: string) => {
  const ref = doc(db, 'users', userId, 'swipes', 'data');
  await setDoc(ref, { likes: [] }, { merge: true });
  await updateDoc(ref, { likes: arrayUnion(jobId) });
};

const dislikeJob = async (userId: string, jobId: string) => {
  const ref = doc(db, 'users', userId, 'swipes', 'data');
  await setDoc(ref, { dislikes: [] }, { merge: true });
  await updateDoc(ref, { dislikes: arrayUnion(jobId) });
};

export  {likeJob , dislikeJob}