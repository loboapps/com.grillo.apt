import React from 'react'

interface SubNavProps {
  title: string
}

const SubNav: React.FC<SubNavProps> = ({ title }) => (
  <div className="bg-apt-400 px-4 py-2 text-apt-100">
    <h2 className="text-sm font-medium">{title}</h2>
  </div>
)

export default SubNav
