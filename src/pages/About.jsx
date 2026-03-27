import { useState } from 'react'

// Define your members data here
const membersData = {
    "2025-2026": [
    { name: "Name", department: "Secretary", picture: "" },
    { name: "Name", department: "Media Team", picture: "" }
  ],
  "2024-2025": [
    { name: "Name", department: "Executive Committee", picture: "" },
    { name: "Name", department: "Treasurer", picture: "" }
  ],
  "2023-2024": [
    { name: "Name", department: "Secretary", picture: "" },
    { name: "Name", department: "Media Team", picture: "" }
  ],
  "2022-2023": [
    { name: "Name", department: "Secretary", picture: "" },
    { name: "Name", department: "Media Team", picture: "" }
  ],
  "2021-2022": [
    { name: "Name", department: "Secretary", picture: "" },
    { name: "Name", department: "Media Team", picture: "" }
  ],
  "2020-2021": [
    { name: "Name", department: "Secretary", picture: "" },
    { name: "Name", department: "Media Team", picture: "" }
  ]
  // Add more years as needed
}

export default function About() {
  const [selectedYear, setSelectedYear] = useState("2026")
  const years = Object.keys(membersData).sort((a,b) => b - a)

  const members = membersData[selectedYear] || []

  return (
    <div className="container">
      <h1>About Us</h1>
      <div className="year-selector">
        <label>Select Year: </label>
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>
      <div className="members-grid">
        {members.map((member, idx) => (
          <div key={idx} className="member-card">
            {member.picture && <img src={member.picture} alt={member.name} />}
            <h3>{member.name}</h3>
            <p>{member.department}</p>
          </div>
        ))}
      </div>
    </div>
  )
}