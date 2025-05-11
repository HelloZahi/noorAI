// pages/index.js
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import toast from 'react-hot-toast';

const EMOTIONS = [
  'Anxious', 'Confused', 'Depressed', 'Doubtful', 'Grateful', 'Guilty', 'Happy', 'Hurt',
  'Jealous', 'Nervous', 'Sad', 'Scared', 'Tired', 'Unloved', 'Lost', 'Peaceful', 'Lonely', 'Confident'
];

const EMOTION_COLORS = {
  Anxious: 'bg-blue-100',
  Confused: 'bg-yellow-100',
  Depressed: 'bg-red-100',
  Doubtful: 'bg-pink-100',
  Grateful: 'bg-green-100',
  Guilty: 'bg-gray-200',
  Happy: 'bg-yellow-200',
  Hurt: 'bg-pink-200',
  Jealous: 'bg-blue-200',
  Nervous: 'bg-orange-100',
  Sad: 'bg-blue-50',
  Scared: 'bg-gray-100',
  Tired: 'bg-yellow-50',
  Unloved: 'bg-red-200',
  Lost: 'bg-gray-50',
  Peaceful: 'bg-green-50',
  Lonely: 'bg-blue-300',
  Confident: 'bg-green-200'
};

export default function Home() {
  const [feeling, setFeeling] = useState('');
  const [response, setResponse] = useState('');
  const [user, setUser] = useState(null);
  const [savedDuas, setSavedDuas] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);

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
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSavedDuas(data);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!feeling.trim()) return toast('Please select or describe your feeling.');
    try {
      const res = await fetch('/api/getDua', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeling }),
      });
      const data = await res.json();
      setResponse(data.message);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch dua.');
    }
  };

  const handleSave = async () => {
    if (!user) return toast.error('Please log in to save your dua.');
    if (!response) return toast('Generate a dua first.');

    try {
      const docRef = await addDoc(collection(db, 'duas'), {
        userId: user.uid,
        content: response,
        createdAt: serverTimestamp(),
      });

      setSavedDuas((prev) => [
        {
          id: docRef.id,
          userId: user.uid,
          content: response,
          createdAt: new Date(),
        },
        ...prev,
      ]);

      toast.success('✅ Dua saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to save the dua.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const ref = doc(db, 'duas', id);
      await deleteDoc(ref);
      setSavedDuas(savedDuas.filter((d) => d.id !== id));
      toast.success('🗑️ Dua deleted');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('❌ Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center px-4 py-10 relative font-serif">
      <Head>
        <title>NoorAI - Islamic Dua Assistant</title>
      </Head>

      {user && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="bg-white border border-gray-800 text-gray-800 px-4 py-2 rounded hover:bg-gray-100 shadow"
          >
            📜 Saved Duas
          </button>
          {showDrawer && (
            <div className="absolute right-0 mt-2 w-80 max-h-[60vh] overflow-y-auto bg-white/95 backdrop-blur border border-gray-300 rounded-xl shadow p-4 space-y-3">
              <h3 className="text-sm font-semibold mb-2">Saved Duas</h3>
              {savedDuas.length === 0 && (
                <p className="text-gray-500 text-sm">No saved duas yet.</p>
              )}
              {savedDuas.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className="relative text-sm border border-gray-200 rounded-lg p-3 bg-white whitespace-pre-wrap shadow-sm"
                >
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="absolute top-1 right-2 text-xs text-red-500 hover:text-red-700"
                  >
                    ✖
                  </button>
                  {d.content}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl p-6 shadow-md">
        <h1 className="text-2xl font-semibold mb-2 text-center text-gray-900">🤲 NoorAI</h1>
        <p className="text-center text-sm text-gray-600 mb-6 italic">
          Select how you feel, and receive a spiritually uplifting dua.
        </p>

        <div className="overflow-x-auto mb-4 scrollbar-hide">
          <div className="flex space-x-3 w-max">
            {EMOTIONS.map((item) => (
              <button
                key={item}
                onClick={() => setFeeling(item)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition shadow-sm font-medium ${
                  feeling === item
                    ? 'bg-black text-white border border-black'
                    : `${EMOTION_COLORS[item] || 'bg-white'} text-gray-800 border border-gray-300 hover:bg-gray-100`
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-md mb-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          rows="3"
          placeholder="Or type how you feel..."
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
        />

        <div className="text-center">
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            ✨ Get Dua
          </button>
        </div>

        {response && (
          <div className="mt-6 border border-gray-300 rounded-xl p-4 bg-gray-50">
            <h2 className="font-semibold mb-2 text-gray-900">🌿 Suggested Dua</h2>
            <p className="whitespace-pre-wrap text-sm mb-2 text-gray-800">{response}</p>
            <button
              onClick={handleSave}
              className="text-xs text-gray-600 underline hover:text-black"
            >
              ❤️ Save this Dua
            </button>
          </div>
        )}
      </div>
      <footer className="absolute bottom-4 w-full text-center text-xs text-gray-500 mt-10">
      <p>May Allah ﷻ guide us, forgive us, and accept our duas. 🤲</p>
      <p className="mt-1">
        © {new Date().getFullYear()} NoorAI. All rights reserved.
      </p>
      <p className="mt-1">
        Built by <strong>Zahi</strong>, Founder at{' '}
        <a href="https://halixlab.com" className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">
          HalixLab
        </a>
      </p>
    </footer>
    </div>
    
    
  );
}

