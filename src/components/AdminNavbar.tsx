import React from 'react'
import { LogoutModal } from './LogoutModal';
import Link from 'next/link';

const AdminNavbar = (props:{setActionType:React.Dispatch<React.SetStateAction<string>>,actionType:string}) => {
  const setPage=(e:React.MouseEvent<HTMLButtonElement>)=>{
    props.setActionType(e.currentTarget.getAttribute("data-active") || "create");
  }
  return (
    <>
    <LogoutModal/>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <Link className="navbar-brand" id='admin-navbar-logo' href="/" style={{display:"flex",justifyContent:"center",alignItems:"center",color:"var(--bs-body-color) !important"}}>News <i className="bi bi-fire"></i> Help</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <button type="button" className={`nav-link${props.actionType=="dashboard"? " active":""}`} aria-current="page" data-active="dashboard" onClick={setPage} >Dashboard</button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link${props.actionType=="create"? " active":""}`} aria-current="page" data-active="create" onClick={setPage} >Post</button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link${props.actionType=="update"? " active":""}`} aria-current="page" data-active="update" onClick={setPage} >Update</button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link${props.actionType=="delete"? " active":""}`} aria-current="page" data-active="delete" onClick={setPage} >Delete</button>
        </li>
      </ul>
        <button className="btn btn-outline-danger" type="button" data-bs-toggle="modal" data-bs-target="#logoutModal">Logout</button>
    </div>
  </div>
</nav>
</>
  )
}

export default AdminNavbar