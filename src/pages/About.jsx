import { useState } from 'react'

const membersData = {
  "2025-2026": [
    { name: "Name", department: "Secretary", picture: "" },
    { name: "Name", department: "Treasurer", picture: "" },
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
}

export default function About() {
  const [selectedYear, setSelectedYear] = useState("2025-2026")
  // Sort years by the starting year (first 4 characters) descending
  const years = Object.keys(membersData).sort((a, b) => {
    const startA = parseInt(a.split('-')[0])
    const startB = parseInt(b.split('-')[0])
    return startB - startA
  })

  const members = membersData[selectedYear] || []

  // Group members by department
  const departments = {}
  members.forEach(member => {
    if (!departments[member.department]) departments[member.department] = []
    departments[member.department].push(member)
  })

  return (
    <div className="container">
      <h1>About Us</h1>
      <div className="year-selector">
        <label>Select Year: </label>
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {Object.entries(departments).map(([dept, deptMembers]) => (
        <div key={dept} className="department-section">
          <h2>{dept}</h2>
          <div className="members-grid">
            {deptMembers.map((member, idx) => (
              <div key={idx} className="member-card">
                {member.picture && <img src={member.picture} alt={member.name} />}
                <h3>{member.name}</h3>
                {/* Department is already shown as section heading, so we can omit it here, or keep it */}
                {member.department !== dept && <p>{member.department}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}