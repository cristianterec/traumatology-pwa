import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchModuleById } from '../utils/strapi'
import { Clock, Users, BookOpen, CheckCircle, XCircle } from 'lucide-react'

export default function ModulePage({ module }) {
  const [showQuizAnswer, setShowQuizAnswer] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [quizCompleted, setQuizCompleted] = useState(false)
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const handleQuizSubmit = () => {
    setQuizCompleted(true)
    setShowQuizAnswer(true)
  }

  const isCorrectAnswer = userAnswer.toLowerCase().includes(module.quizAnswer?.toLowerCase() || '')

  return (
    <>
      <Head>
        <title>{module.title} - Traumatologie Urgences</title>
        <meta name="description" content={module.description} />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="glass-card p-8 rounded-xl mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  module.priority === 'emergency' ? 'bg-red-100 text-red-800' :
                  module.priority === 'urgent' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {module.priority}
                </span>
                <span className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {module.duration} min
                </span>
                <span className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  {module.category}
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{module.title}</h1>
            <p className="text-xl text-gray-600">{module.description}</p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Image */}
              {module.image && (
                <div className="glass-card p-6 rounded-xl mb-8">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={module.image.url}
                      alt={module.image.alt || module.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Medical Content */}
              <div className="glass-card p-8 rounded-xl mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenu médical</h2>
                <div className="medical-content prose max-w-none">
                  <p>{module.content || "Contenu détaillé du module à venir..."}</p>
                </div>
              </div>

              {/* Quiz Section */}
              {module.quizQuestion && (
                <div className="glass-card p-8 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quiz d'évaluation</h3>
                  <div className="quiz-container">
                    <p className="font-medium text-gray-800 mb-4">{module.quizQuestion}</p>
                    
                    {!quizCompleted ? (
                      <div>
                        <textarea
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Votre réponse..."
                          className="glass-input w-full p-4 rounded-lg mb-4 h-24 resize-none"
                        />
                        <button
                          onClick={handleQuizSubmit}
                          disabled={!userAnswer.trim()}
                          className="glass-button px-6 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
                        >
                          Valider ma réponse
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className={`p-4 rounded-lg flex items-center ${
                          isCorrectAnswer ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
                        }`}>
                          {isCorrectAnswer ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-orange-600 mr-2" />
                          )}
                          <span className={isCorrectAnswer ? 'text-green-800' : 'text-orange-800'}>
                            {isCorrectAnswer ? 'Bonne réponse !' : 'Réponse à améliorer'}
                          </span>
                        </div>
                        
                        {showQuizAnswer && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="font-medium text-blue-800 mb-2">Réponse attendue :</p>
                            <p className="text-blue-700">{module.quizAnswer}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Module Info */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4">Informations</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Catégorie</span>
                    <p className="text-gray-900">{module.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Type d'os</span>
                    <p className="text-gray-900">{module.boneType}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Durée</span>
                    <p className="text-gray-900">{module.duration} minutes</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4">Navigation</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => router.back()}
                    className="w-full glass-button p-3 rounded-lg text-left hover:bg-gray-50"
                  >
                    ← Retour aux modules
                  </button>
                  <button className="w-full glass-button p-3 rounded-lg text-left hover:bg-gray-50">
                    📚 Autres modules similaires
                  </button>
                  <button className="w-full glass-button p-3 rounded-lg text-left hover:bg-gray-50">
                    📋 Voir tous les quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  try {
    const module = await fetchModuleById(params.id)
    return {
      props: { module },
      revalidate: 3600
    }
  } catch (error) {
    return { notFound: true }
  }
}
