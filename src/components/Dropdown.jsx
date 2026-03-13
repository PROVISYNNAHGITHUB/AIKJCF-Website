import { useState } from 'react'

export default function Dropdown({ label, items }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="dropdown" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="dropdown-btn">{label} ▼</button>
      {isOpen && (
        <div className="dropdown-content">
          {items.map((item, index) => (
            <a key={index} href={item.link}>{item.text}</a>
          ))}
        </div>
      )}
    </div>
  )
}