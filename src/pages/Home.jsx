import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Home() {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLatestPost()
  }, [])

  async function fetchLatestPost() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('Error fetching latest post:', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!post) return <div className="container"><p>No posts yet.</p></div>

  return (
    <div className="container">
      <h1>Latest Update</h1>
      <div className="latest-post">
        {post.title && <h2>{post.title}</h2>}
        
        {post.type === 'text' && (
          <div className="text-content">{post.content}</div>
        )}

        {post.type === 'image' && post.file_url && (
          <img src={post.file_url} alt={post.title} />
        )}

        {post.type === 'video' && post.file_url && (
          <video controls src={post.file_url} />
        )}

        <p className="post-meta">
          Posted on: {new Date(post.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  )
}