"use client";
import axios from 'axios';
import React, { useState } from 'react'

const CreateCategoryModal = (props:any) => {
  const [category, setCategory] = useState("");
  const handleCreateCategory = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response=props.setCategories([...props.categories,(await axios.post('/api/category',{value:category})).data]);
  }
  return (
<div className="modal fade" id="createCategoryModal" tabIndex={-1} aria-labelledby="createCategoryModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="createCategoryModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form onSubmit={handleCreateCategory}>
      <div className="modal-body">
        <input type="text" name="newCategory" id="newCategory" className="form-control" placeholder='Enter a new category' value={category} onInput={(e)=>{setCategory(e.currentTarget.value)}}/>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="submit" className="btn btn-primary">Create new Category</button>
      </div>
      </form>
    </div>
  </div>
</div>
  )
}

export default CreateCategoryModal