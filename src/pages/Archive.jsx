import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Archive() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="container">
      <h1>Archive</h1>
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            {post.type === 'text' && (
              <div className="card-content">
                <h3>{post.title || 'Untitled'}</h3>
                <p className="text-preview">{post.content}</p>
              </div>
            )}
            {post.type === 'image' && post.file_url && (
              <>
                <div className="media">
                  <img src={post.file_url} alt={post.title} />
                </div>
                <div className="card-content">
                  <h3>{post.title || 'Untitled'}</h3>
                </div>
              </>
            )}
            {post.type === 'video' && post.file_url && (
              <>
                <div className="media">
                  <video src={post.file_url} />
                </div>
                <div className="card-content">
                  <h3>{post.title || 'Untitled'}</h3>
                </div>
              </>
            )}
            <div className="date">
              {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}