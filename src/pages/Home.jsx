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
        <div className='overview-section'>
          <h1>Overview</h1>
          <p id='overview'>Nakliar: Nakliar u lum Makashang yn lah ban iohi ia ka Ri India.</p>
          <p>Ki lum ba jyrngam ka thaiñ Shatei Lam Mihngi, ka ri shyiap baïar ka thaiñ Sepngi, ki shnong ba itynnad ha ki thaiñ Shathie ha syndah ka Thwei ba ïar ka Duriaw Bah India, ki lum thah ha trai u Lum Makashang ha ki thaiñ Shatei ka Ri India.</p>
          <p>Hapdeng ka jylli sawdong sawkun kumne U TRAI Uba U BLEI U la pynkha ia ka All India Khasi Jaiñtia Christian Fellowship. Ka kynhun Ki Jingiaseng ki khun Khristan kiba sah, kiba trei, kiba pule, bad kiba leit phah sumar ha kylleng ki bynta ka Ri India. Ki Khasi Jaiñtia Christian Fellowship bapher bapher, ki Khasi Christian Fellowship bapher bapher, ka Meghalaya Christian Fellowship bad kiwei ki kynhun Khristan kiba pdiang bad kyrshan ia ka AIKJCF ka rynsan jong baroh ki Khun Khristan, ngi buh haka ktien phareng kumne(The Non-Denominational Entity)</p>
        </div>
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