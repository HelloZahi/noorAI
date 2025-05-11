// pages/saved.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebaseConfig';
import {
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from 'firebase/firestore';

export default function Saved() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duas, setDuas] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const q = query(
          collection(db, 'duas'),
          where('userId', '==', u.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setDuas(data);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading…</div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-700">You need to be logged in to view saved duas.</p>
        <Link href="/">
          <a className="text-blue-600 underline">Go back</a>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <Head>
        <title>My Saved Duas | NoorAI</title>
      </Head>

      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">💖 My Saved Duas</h1>
          <button
            onClick={logout}
            className="text-red-500 text-sm underline hover:text-red-700"
          >
            Logout
          </button>
        </div>

        {duas.length === 0 && (
          <p className="text-gray-600">You haven’t saved any dua yet.</p>
        )}

        <ul className="space-y-4 max-h-[60vh] overflow-auto pr-2">
          {duas.map((d) => (
            <li
              key={d.id}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50 whitespace-pre-wrap"
            >
              {d.content}
            </li>
          ))}
        </ul>

        <Link href="/">
          <a className="block text-center text-blue-600 underline">
            ← Back to home
          </a>
        </Link>
      </div>
    </div>
  );
}
