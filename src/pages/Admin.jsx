import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [selectedPostId, setSelectedPostId] = useState('')
  const [type, setType] = useState('text')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login')
      } else {
        setUser(session.user)
        fetchPosts()
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login')
      } else {
        setUser(session.user)
        fetchPosts()
      }
    })
    return () => listener?.subscription.unsubscribe()
  }, [navigate])

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      let fileUrl = null

      if (type !== 'text') {
        if (!file) throw new Error('Please select a file')
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = fileName

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file)
        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(filePath)
        fileUrl = urlData.publicUrl
      }

      const { error } = await supabase.from('posts').insert({
        type,
        title: title || null,
        content: type === 'text' ? content : null,
        file_url: fileUrl,
        uploaded_by: user.id
      })
      if (error) throw error

      setTitle('')
      setContent('')
      setFile(null)
      alert('Post created!')
      fetchPosts() // refresh the dropdown
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedPostId) {
      alert('Please select a post to delete.')
      return
    }
    const post = posts.find(p => p.id === selectedPostId)
    if (!window.confirm(`Are you sure you want to delete "${post?.title || 'Untitled'}"?`)) return
    setDeleting(true)

    try {
      // If post has a file, delete it from storage
      if (post?.file_url) {
        const urlParts = post.file_url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('media')
            .remove([fileName])
          if (storageError) console.error('Error deleting file:', storageError.message)
        }
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', selectedPostId)

      if (error) throw error

      alert('Post deleted')
      setSelectedPostId('')
      fetchPosts() // refresh dropdown
    } catch (error) {
      alert('Error deleting post: ' + error.message)
    } finally {
      setDeleting(false)
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

      <h2>Create New Post</h2>
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
          </div>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Create Post'}
        </button>
      </form>

      <h2 style={{ marginTop: '3rem' }}>Delete a Post</h2>
      <div className="delete-section">
        <div className="form-group">
          <label>Select post to delete:</label>
          <select
            value={selectedPostId}
            onChange={(e) => setSelectedPostId(e.target.value)}
            className="post-select"
          >
            <option value="">-- Choose a post --</option>
            {posts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title || 'Untitled'} ({post.type}) – {new Date(post.created_at).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting || !selectedPostId}
          className="delete-btn"
        >
          {deleting ? 'Deleting...' : 'Delete Selected Post'}
        </button>
      </div>
    </div>
  )
}