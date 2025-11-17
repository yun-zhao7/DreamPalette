import './NightCard.css'
import { NightAnalysis } from '../types'

// Props that the NightCard component expects to receive
interface NightCardProps {
  analysis: NightAnalysis  // The full analysis data from the AI
}

// Helper function to create a gradient from an array of colors
function createGradient(colors: string[]): string {
  if (colors.length === 0) {
    // Fallback gradient if no colors provided
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
  
  if (colors.length === 1) {
    // If only one color, use it as a solid background
    return colors[0]
  }
  
  // Create a gradient from the colors
  // Distribute colors evenly across the gradient
  const colorStops = colors.map((color, index) => {
    const percentage = (index / (colors.length - 1)) * 100
    return `${color} ${percentage}%`
  }).join(', ')
  
  return `linear-gradient(135deg, ${colorStops})`
}

// NightCard component: displays a colored gradient card with the AI's analysis
// This is what appears after clicking "Generate my night"
function NightCard({ analysis }: NightCardProps) {
  // Create a gradient from the colors provided by the AI
  const gradient = createGradient(analysis.colors)

  return (
    <div 
      className="night-card"
      style={{ background: gradient }}
    >
      <div className="night-card-content">
        {/* Title from the AI */}
        <h2 className="night-card-title">{analysis.title}</h2>
        
        {/* Summary - the main reflection */}
        <p className="night-card-summary">{analysis.summary}</p>
        
        {/* Emotions and themes as tags */}
        <div className="night-card-tags">
          {analysis.emotions.length > 0 && (
            <div className="tag-group">
              <span className="tag-label">Emotions:</span>
              <div className="tags">
                {analysis.emotions.map((emotion, index) => (
                  <span key={index} className="tag">{emotion}</span>
                ))}
              </div>
            </div>
          )}
          {analysis.themes.length > 0 && (
            <div className="tag-group">
              <span className="tag-label">Themes:</span>
              <div className="tags">
                {analysis.themes.map((theme, index) => (
                  <span key={index} className="tag">{theme}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Intensity indicator */}
        {analysis.intensity !== undefined && (
          <div className="intensity-section">
            <span className="intensity-label">Intensity:</span>
            <div className="intensity-bar">
              <div 
                className="intensity-fill"
                style={{ width: `${Math.min(100, Math.max(0, analysis.intensity * 10))}%` }}
              />
            </div>
            <span className="intensity-value">{analysis.intensity}/10</span>
          </div>
        )}
        
        {/* Gentle note - the warm, human message */}
        <p className="night-card-note">{analysis.gentleNote}</p>
      </div>
    </div>
  )
}

export default NightCard

