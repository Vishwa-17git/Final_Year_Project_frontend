import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Results.css'

function Results() {
  const navigate = useNavigate()
  const [analysisResults, setAnalysisResults] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate AI analysis
    const analysisData = sessionStorage.getItem('analysisData')
    
    if (!analysisData) {
      navigate('/dashboard')
      return
    }

    const data = JSON.parse(analysisData)

    // Simulate analysis delay
    setTimeout(() => {
      setAnalysisResults({
        riskScore: Math.floor(Math.random() * 100),
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        textAnalysis: {
          score: Math.floor(Math.random() * 100),
          issues: generateTextIssues()
        },
        imageAnalysis: {
          score: Math.floor(Math.random() * 100),
          images: data.imageCount,
          status: data.imageCount > 0 ? 'Analyzed' : 'No images'
        },
        linkAnalysis: {
          score: Math.floor(Math.random() * 100),
          url: data.jobLink || 'Not provided',
          status: data.jobLink ? 'Safe' : 'Not analyzed'
        },
        recommendations: generateRecommendations()
      })
      setIsLoading(false)
    }, 2000)
  }, [navigate])

  const generateTextIssues = () => {
    const issues = [
      'Multiple grammar errors detected',
      'Unrealistic salary claim',
      'Suspicious urgency language',
      'Missing company details'
    ]
    return issues.slice(0, Math.floor(Math.random() * 4) + 1)
  }

  const generateRecommendations = () => {
    return [
      'Research the company on LinkedIn and official websites',
      'Verify contact information independently',
      'Check for recent complaints on Better Business Bureau',
      'Never share personal financial information before official hire',
      'Schedule a video call with the hiring manager'
    ]
  }

  if (isLoading) {
    return (
      <main className="results-container">
        <div className="loading-section">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <h2>Analyzing Job Posting</h2>
          <p>Our AI is scanning the job description, images, and links...</p>
        </div>
      </main>
    )
  }

  if (!analysisResults) {
    return (
      <main className="results-container">
        <div className="container">
          <div className="error-section">
            <h2>Something went wrong</h2>
            <p>Please try again with a new job posting</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Analyze Another Job
            </button>
          </div>
        </div>
      </main>
    )
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return '#10b981'
      case 'Medium': return '#f59e0b'
      case 'High': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <main className="results-container">
      <div className="results-header">
        <div className="container">
          <h1>Analysis Complete</h1>
          <p>Here's what we found about this job posting</p>
        </div>
      </div>

      <div className="container results-content">
        {/* Risk Score Card */}
        <div className="risk-score-card">
          <div className="risk-circle">
            <div
              className="risk-meter"
              style={{ 
                background: `conic-gradient(${getRiskColor(analysisResults.riskLevel)} 0deg, ${getRiskColor(analysisResults.riskLevel)} ${analysisResults.riskScore * 3.6}deg, #e5e7eb ${analysisResults.riskScore * 3.6}deg)`
              }}
            >
              <div className="risk-center">
                <div className="risk-score">{analysisResults.riskScore}</div>
                <div className="risk-label">Risk Score</div>
              </div>
            </div>
          </div>
          <div className="risk-info">
            <h2>Overall Risk Level</h2>
            <div
              className="risk-badge"
              style={{ background: getRiskColor(analysisResults.riskLevel) }}
            >
              {analysisResults.riskLevel}
            </div>
            <p>
              {analysisResults.riskLevel === 'Low' &&
                'This job posting appears to be legitimate based on our analysis.'}
              {analysisResults.riskLevel === 'Medium' &&
                'Some indicators suggest caution. Verify details with the company.'}
              {analysisResults.riskLevel === 'High' &&
                'Multiple red flags detected. Proceed with extreme caution.'}
            </p>
          </div>
        </div>

        {/* Analysis Results Grid */}
        <div className="analysis-grid">
          {/* Text Analysis */}
          <div className="analysis-card">
            <div className="card-header">
              <h3>📝 Text Analysis</h3>
              <div className="score-badge" style={{ background: getScoreColor(analysisResults.textAnalysis.score) }}>
                {analysisResults.textAnalysis.score}%
              </div>
            </div>
            <div className="card-content">
              {analysisResults.textAnalysis.issues.length > 0 ? (
                <>
                  <p className="card-title">Issues Found:</p>
                  <ul className="issues-list">
                    {analysisResults.textAnalysis.issues.map((issue, i) => (
                      <li key={i}>
                        <span className="issue-icon">⚠️</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="success-text">✓ No major text issues detected</p>
              )}
            </div>
          </div>

          {/* Image Analysis */}
          <div className="analysis-card">
            <div className="card-header">
              <h3>🖼️ Image Analysis</h3>
              <div className="score-badge" style={{ background: getScoreColor(analysisResults.imageAnalysis.score) }}>
                {analysisResults.imageAnalysis.score}%
              </div>
            </div>
            <div className="card-content">
              <div className="stat-row">
                <span>Images Analyzed:</span>
                <strong>{analysisResults.imageAnalysis.images}</strong>
              </div>
              <div className="stat-row">
                <span>Status:</span>
                <strong>{analysisResults.imageAnalysis.status}</strong>
              </div>
            </div>
          </div>

          {/* Link Analysis */}
          <div className="analysis-card">
            <div className="card-header">
              <h3>🔗 Link Analysis</h3>
              <div className="score-badge" style={{ background: getScoreColor(analysisResults.linkAnalysis.score) }}>
                {analysisResults.linkAnalysis.score}%
              </div>
            </div>
            <div className="card-content">
              <div className="stat-row">
                <span>URL:</span>
                <strong className="url-text" title={analysisResults.linkAnalysis.url}>
                  {analysisResults.linkAnalysis.url}
                </strong>
              </div>
              <div className="stat-row">
                <span>Safety Status:</span>
                <strong style={{ color: getScoreColor(analysisResults.linkAnalysis.score) }}>
                  {analysisResults.linkAnalysis.status}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <h2>Recommended Steps</h2>
          <div className="recommendations-list">
            {analysisResults.recommendations.map((rec, i) => (
              <div key={i} className="recommendation-item">
                <div className="rec-number">{i + 1}</div>
                <div className="rec-content">
                  <p>{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Analyze Another Job
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            Print Report
          </button>
        </div>
      </div>
    </main>
  )
}

function getScoreColor(score) {
  if (score >= 75) return '#10b981'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

export default Results
