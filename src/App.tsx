import { useState } from 'react'
import './App.css'
import NightCard from './components/NightCard'
import { analyzeNight } from './api/analyzeNight'
import { NightAnalysis } from './types'

// This is the main App component
// It manages the state for the dream input and the generated night card
function App() {
  // State to store what the user types in the text box
  const [dreamInput, setDreamInput] = useState('')
  
  // State to store the generated night card data (null means no card shown yet)
  const [nightCardData, setNightCardData] = useState<NightAnalysis | null>(null)
  
  // State to track if we're currently loading (calling the API)
  const [isLoading, setIsLoading] = useState(false)
  
  // State to store any error messages
  const [error, setError] = useState<string | null>(null)

  // This function is called when the user clicks "Generate my night"
  const handleGenerate = async () => {
    // Don't do anything if the input is empty
    if (!dreamInput.trim()) {
      setError('Please describe your sleep and dreams first.')
      return
    }

    // Clear any previous errors and hide the previous card
    setError(null)
    setNightCardData(null)
    setIsLoading(true)

    try {
      // Call the AI API to analyze the dream
      // We're not passing sleepData yet, but the function is ready for it
      const analysis = await analyzeNight(dreamInput.trim())
      
      // Update the state with the AI's response
      setNightCardData(analysis)
    } catch (err) {
      // Handle errors gracefully
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
      // Clear the card data on error
      setNightCardData(null)
    } finally {
      // Always stop loading, whether we succeeded or failed
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <h1 className="app-title">Dream Palette</h1>
      
      <div className="input-section">
        {/* Big text box for typing dreams */}
        <textarea
          className="dream-input"
          placeholder="Describe how you slept and what you dreamed..."
          value={dreamInput}
          onChange={(e) => setDreamInput(e.target.value)}
          rows={8}
        />
        
        {/* Button to generate the night card */}
        <button 
          className="generate-button"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate my night'}
        </button>
      </div>

      {/* Show error message if something went wrong */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* NightCard area - only shows when nightCardData exists */}
      {nightCardData && (
        <NightCard analysis={nightCardData} />
      )}
    </div>
  )
}

export default App

