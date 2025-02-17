"use client";
import Link from 'next/link';
import React from 'react'

const Footer = () => {
  return (
    <div className="container">
  <footer className="py-5">
    <div className="d-flex justify-content-between flex-wrap">
      <div className="me-5">
        <h5>Legal</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2"><Link href="/privacy-policy" className="nav-link p-0 text-body-secondary">Privacy Policy</Link></li>
          <li className="nav-item mb-2"><Link href="/terms-of-services" className="nav-link p-0 text-body-secondary">Terms of Services</Link></li>
        </ul>
      </div>
    </div>

    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center py-3 my-4 border-top">
      <p>© 2024-2025 NewsHelp. All rights reserved.</p>
      <ul className="list-unstyled d-flex">
        <li className="ms-3"><a className="link-body-emphasis" target="_blank" href="https://twitter.com"><i className='bi bi-twitter fs-4'></i></a></li>
        <li className="ms-3"><a className="link-body-emphasis" target="_blank" href="https://instagram.com"><i className='bi bi-instagram fs-4'></i></a></li>
        <li className="ms-3"><a className="link-body-emphasis" target="_blank" href="https://facebook.com"><i className='bi bi-facebook fs-4'></i></a></li>
      </ul>
    </div>
  </footer>
</div>
  )
}

export default Footer