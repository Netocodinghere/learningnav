'use client';
import { useState, useEffect } from 'react';
import { FaPlus, FaRobot } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import Flashcard from '../../_components/FlashCard';
import { useParams } from 'next/navigation';
export default function StudyPage() {
  const [studyHours, setStudyHours] = useState(2.5);
  const [study,setStudy]=useState(null)
  const [user,setUser]=useState(null)
  const [metrics,setMetrics]=useState(null)
  const [accessToken,setAccessToken]=useState(null)
  const {id}=useParams()

  useEffect(()=>{
    
    const fetchUser = async () => {

      const { data: { session } } = await supabase.auth.getSession()

      setUser(session?.user || null)
      setAccessToken(session?.access_token || null)
     
      if(session?.user){

        const metrics= await fetch("/api/get/profile",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            user_id:session?.user?.id
          })
        })
        const res= await metrics.json()
        setMetrics(res.data || null)

        const study= await fetch("/api/get/study",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            user_id:session?.user?.id,
            study_id:id
          })
        })
        const studyRes= await study.json()

        setStudy(studyRes.data)

 
        
      }
    }
    fetchUser()
  },[])
 
 

  const flashcards = [
    {
      question: 'What is React?',
      answer: 'A JavaScript library for building user interfaces.',
    },
    {
      question: 'What is JSX?',
      answer: 'A syntax extension that lets you write HTML in JavaScript.',
    },
    {
      question: 'What are props?',
      answer: 'Props are inputs to components that allow data to be passed between components.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white   sm:p-8">
      <div className="max-w-5xl mx-auto space-y-10 pt-32">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">📚 Study Session</h1>
          <div className="flex items-center gap-2 text-sm text-cyan-300">
            <FiClock />
            <span>{studyHours} hours studied</span>
          </div>
        </div>

        {/* Flashcards */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Flashcards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {study.flashcards.map((card, index) => (
              <Flashcard key={index} question={card.front} answer={card.back} />
            ))}
          </div>
        </section>

        {/* AI Chat Section */}
        <section className="bg-white/5 backdrop-blur rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FaRobot /> Ask Your AI Teacher
          </h2>
          <textarea
            placeholder="Ask a question..."
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
            rows={3}
          />
          <button className="mt-3 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-md font-medium transition">
            Send
          </button>
        </section>

        {/* Cheatsheet & Notes */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">📄 Cheatsheet</h3>
            <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
              <li>Nothing Here Yet</li>
            </ul>
          </div>

          <div className="bg-white/5 p-4 rounded-lg flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-2">📝 Notes</h3>
              <p className="text-sm text-gray-300">You haven't added any notes yet.</p>
            </div>
            <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-sm font-medium transition self-start">
              <FaPlus />
              Add Notes
            </button>
          </div>
        </section>

        {/* Take a Quiz Button */}
        <div className="text-center">
          <button className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold text-base rounded-xl transition">
            Take a Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
