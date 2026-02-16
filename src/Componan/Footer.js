import React from 'react'

export default function Footer() {
  return (
<div className="footer">
  <p>
    © {new Date().getFullYear()} قاوم — تم التطوير بواسطة{" "}
    <a 
      href="https://adelmhmd77.github.io/Adel-Mohammed/" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      عادل محمد
    </a>{" "}
    و{" "}
    <a 
      href="https://your-link-hazem.com" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      حازم النمر
    </a>
  </p>
</div>

  )
}
