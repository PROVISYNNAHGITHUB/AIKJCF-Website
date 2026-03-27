import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function NaThiar() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', 'nathiar')
      .order('created_at', { ascending: false })
    if (!error) setPosts(data)
    setLoading(false)
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="container">
      <h1>Na Thiar</h1>
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-item">
            <h3>{post.title}</h3>
            {post.type === 'text' ? <p>{post.content}</p> :
              post.type === 'image' ? <img src={post.file_url} alt={post.title} /> :
              <video controls src={post.file_url} />}
            <p className="date">{new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}