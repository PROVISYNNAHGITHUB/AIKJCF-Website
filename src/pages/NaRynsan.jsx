import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function NaRynsan() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGallery()
  }, [])

  async function fetchGallery() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', 'gallery')
      .order('created_at', { ascending: false })
    if (!error) setPosts(data)
    setLoading(false)
  }

  // Group by title
  const albums = posts.reduce((acc, post) => {
    const title = post.title || 'Untitled'
    if (!acc[title]) acc[title] = []
    acc[title].push(post)
    return acc
  }, {})

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="container">
      <h1>Na Rynsan</h1>
      {Object.entries(albums).map(([albumTitle, items]) => (
        <div key={albumTitle} className="album">
          <h2>{albumTitle}</h2>
          <div className="gallery-grid">
            {items.map(item => (
              <div key={item.id} className="gallery-item">
                {item.type === 'image' && <img src={item.file_url} alt={item.title} />}
                {item.type === 'video' && <video controls src={item.file_url} />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}