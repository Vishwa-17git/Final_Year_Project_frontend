import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    jobDescription: '',
    jobLink: '',
    images: []
  })

  const [errors, setErrors] = useState({})
  const [isValidUrl, setIsValidUrl] = useState(null)
  const [charCount, setCharCount] = useState(0)

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleDescriptionChange = (e) => {
    let value = e.target.value
    if (value.length > 5000) {
      value = value.substring(0, 5000)
    }
    setFormData({ ...formData, jobDescription: value })
    setCharCount(value.length)
  }

  const handleLinkChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, jobLink: value })
    if (value) {
      const valid = validateUrl(value)
      setIsValidUrl(valid)
    } else {
      setIsValidUrl(null)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    addImages(files)
  }

  const addImages = (files) => {
    const newImages = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`)
        return false
      }
      return true
    }).map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }))

    setFormData({
      ...formData,
      images: [...formData.images, ...newImages]
    })
  }

  const removeImage = (id) => {
    setFormData({
      ...formData,
      images: formData.images.filter(img => img.id !== id)
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over')
    const files = Array.from(e.dataTransfer.files)
    addImages(files)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required'
    }

    if (formData.jobLink && !isValidUrl) {
      newErrors.jobLink = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Store form data in session storage for Results page
    sessionStorage.setItem('analysisData', JSON.stringify({
      jobDescription: formData.jobDescription,
      jobLink: formData.jobLink,
      imageCount: formData.images.length
    }))

    navigate('/results')
  }

  return (
    <main className="dashboard-container">
      <div className="dashboard-header">
        <div className="container">
          <h1>Analyze a Job Posting</h1>
          <p>Upload job details and let our AI analyze it for potential scams</p>
        </div>
      </div>

      <div className="container dashboard-content">
        <form onSubmit={handleSubmit} className="analysis-form">
          {/* Job Description Section */}
          <div className="form-section">
            <h2>Job Description</h2>
            <div className="form-group">
              <label htmlFor="jobDescription">
                Paste the job description here
                <span className="required">*</span>
              </label>
              <textarea
                id="jobDescription"
                value={formData.jobDescription}
                onChange={handleDescriptionChange}
                placeholder="Copy and paste the full job posting..."
                className={errors.jobDescription ? 'error' : ''}
              ></textarea>
              <div className="char-counter">
                {charCount} / 5000 characters
              </div>
              {errors.jobDescription && (
                <div className="error-message">{errors.jobDescription}</div>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="form-section">
            <h2>Company Images</h2>
            <div
              className="drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="drop-zone-content">
                <div className="upload-icon">📤</div>
                <h3>Drag and drop images here</h3>
                <p>or</p>
              </div>
              <input
                type="file"
                id="imageInput"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              <label htmlFor="imageInput" className="btn btn-secondary">
                Choose Images
              </label>
              <p className="upload-help">Max 5MB per file (PNG, JPG, GIF)</p>
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="image-preview">
                <h3>Selected Images ({formData.images.length})</h3>
                <div className="image-grid">
                  {formData.images.map(img => (
                    <div key={img.id} className="image-item">
                      <img src={img.preview} alt="preview" />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeImage(img.id)}
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Job Link Section */}
          <div className="form-section">
            <h2>Job Posting URL</h2>
            <div className="form-group">
              <label htmlFor="jobLink">Job posting link (optional)</label>
              <div className="input-wrapper">
                <input
                  type="url"
                  id="jobLink"
                  value={formData.jobLink}
                  onChange={handleLinkChange}
                  placeholder="https://example.com/job/123"
                  className={isValidUrl === false ? 'error' : ''}
                />
                {isValidUrl !== null && (
                  <span className={`validation-icon ${isValidUrl ? 'valid' : 'invalid'}`}>
                    {isValidUrl ? '✓' : '✗'}
                  </span>
                )}
              </div>
              {errors.jobLink && (
                <div className="error-message">{errors.jobLink}</div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Analyze Job Posting
            </button>
            <p className="info-text">
              💡 Tip: Upload all available job details for the most accurate analysis
            </p>
          </div>
        </form>

        {/* Info Cards */}
        <div className="info-section">
          <h2>What We Analyze</h2>
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">📝</div>
              <h3>Text Analysis</h3>
              <p>Grammar, spelling, suspicious keywords, and unrealistic promises</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🖼️</div>
              <h3>Image Analysis</h3>
              <p>Logo authenticity, reverse image search, and visual inconsistencies</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🔗</div>
              <h3>Link Analysis</h3>
              <p>Domain reputation, HTTPS security, phishing signals, and URL patterns</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Dashboard
