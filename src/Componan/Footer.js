import React from 'react'

export default function Footer() {
  return (
<div className="footer">
  <p>
    © {new Date().getFullYear()} قاوم — تم التطوير بواسطة{" "}
    <a
      href="https://adel-mhmd.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
    >
      عادل محمد
    </a>{" "}
    و{" "}
    <a
      href="https://github.com/hazem623"
      target="_blank"
      rel="noopener noreferrer"
    >
      حازم النمر
    </a>
  </p>
</div>

  )
}
