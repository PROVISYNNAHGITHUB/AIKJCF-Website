import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'



export default function Admin() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('text')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) {
      navigate('/login')
    } else {
      setUser(session.user)
    }
    setLoading(false)
  })

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) {
      navigate('/login')
    } else {
      setUser(session.user)
    }
  })

  return () => listener?.subscription.unsubscribe()
}, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      let fileUrl = null

      // If type is image or video, upload the file to Supabase Storage
      if (type !== 'text') {
        if (!file) {
          throw new Error('Please select a file to upload')
        }

        // Generate a unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = fileName

        // Upload to Supabase
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(filePath)

        fileUrl = urlData.publicUrl
      }

      // Insert post into database
      const { error } = await supabase.from('posts').insert({
        type,
        title: title || null,
        content: type === 'text' ? content : null,
        file_url: fileUrl,
        uploaded_by: user.id
      })

      if (error) throw error

      // Reset form
      setTitle('')
      setContent('')
      setFile(null)
      alert('Post created successfully!')
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button className="logout-btn" onClick={() => supabase.auth.signOut()}>
          Logout
        </button>
      </div>
      <p>Welcome, {user?.email}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="text">Text Message</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="form-group">
          <label>Title (optional):</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {type === 'text' ? (
          <div className="form-group">
            <label>Message:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Select File:</label>
            <input
              type="file"
              accept={type === 'image' ? 'image/*' : 'video/*'}
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            <small>Max file size depends on your Supabase plan (free tier allows up to 50MB).</small>
          </div>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}
