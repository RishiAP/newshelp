"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { NewsContent } from "@/app/admin/page";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

const NewsCRUDComponent = (props: {
  type: string;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  formData: NewsContent;
  setFormData: React.Dispatch<React.SetStateAction<NewsContent>>;
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function getCategories() {
      setCategories((await axios.get("/api/category")).data);
    }
    getCategories();
  }, []);

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      ["link", "image", "video", "formula"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const getCategoryString = (category: string | { _id: Object; value: string }) => {
    return typeof category === "string" ? category : category.value;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setFormData({ ...props.formData, title: e.currentTarget.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.setFormData({ ...props.formData, category: e.currentTarget.value });
  };

  const handleTopImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files?.length>0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.currentTarget.files[0]);
      reader.onload = function () {
        props.setFormData({
          ...props.formData,
          topimage: reader.result ? reader.result.toString() : "",
        });
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
    else if(e.currentTarget.files && e.currentTarget.files?.length==0){
      props.setFormData({
        ...props.formData,
        topimage: "",
      });
    }
  };

  const handleEditorChange = (content: any, delta: any, source: any, editor: any) => {
    props.setFormData({ ...props.formData, content: editor.getContents() });
  };

  return (
    <form className="d-flex flex-column" id="articleControlForm" onSubmit={props.handleSubmit}>
      <fieldset>
      <label htmlFor="newsTitle" className="form-label">
        Title
      </label>
      <input
        type="text"
        className="form-control mb-3"
        id="newsTitle"
        value={props.formData.title}
        onInput={handleTitleChange}
        placeholder="Enter title of the news"
        disabled={props.type === "delete"}
        required={props.type !== "delete"}
      />
      <label htmlFor="categorySelect" className="form-label">
        Category
      </label>
      <select
        className="form-select mb-3"
        id="categorySelect"
        onInput={handleCategoryChange}
        value={getCategoryString(props.formData.category)}
        disabled={props.type === "delete"}
        required={props.type !== "delete"}
      >
        <option value="" disabled>
          Select Category
        </option>
        {categories.map((category: any) => (
          <option key={category._id} value={category.value}>
            {category.value}
          </option>
        ))}
      </select>
      <label htmlFor="categorySelect" className="form-label">
        Priority
      </label>
      <select
        className="form-select mb-3"
        id="prioritySelect"
        onInput={
          (e: React.ChangeEvent<HTMLSelectElement>) => {
            props.setFormData({ ...props.formData, priority: e.currentTarget.value=="null"?null:e.currentTarget.value });
          }
        }
        value={"priority"in props.formData? (props.formData.priority==null? "null":props.formData.priority):""}
        disabled={props.type === "delete"}
        required={props.type !== "delete"}
      >
        <option value="" disabled>
          Select Priority
        </option>
        <option value="TopMost">Top Most News</option>
        <option value="Headline">Headline</option>
        <option value="null">None</option>
      </select>
      <div className={`mb-3${props.type === "delete"?" d-none":""}`}>
        <label htmlFor="formFile" className="form-label">
          Top Image
        </label>
        <input
          className="form-control"
          type="file"
          id="formFile"
          accept="image/*"
          required={props.type === "create"}
          onInput={handleTopImage}
        />
      </div>
      <div className="d-flex justify-content-center w-100">
        {props.formData.topimage && (
          <img
            src={props.formData.topimage}
            width={0}
            height={0}
            sizes="100vw"
            style={{ maxWidth: "100%", width: "auto", height: "auto" }}
            alt=""
          />
        )}
      </div>
      <label htmlFor="newsContent" className="form-label">
        Content
      </label>
      <div className="">
        <QuillEditor
          value={props.formData.content}
          onChange={handleEditorChange}
          readOnly={props.type === "delete"}
          modules={props.type==="delete"?{toolbar:false} : quillModules}
          id="newsContent"
          className="w-full h-[70%] mt-10 bg-white"
        />
      </div>
      <button
        type="submit"
        className={`btn ${
          props.type === "create"
            ? "btn-success"
            : props.type === "update"
            ? "btn-primary"
            : "btn-danger"
        } btn-lg mt-3 w-100`}
      >
        {props.type === "create"
          ? "Publish"
          : props.type === "update"
          ? "Update"
          : "Delete"}
      </button>
      </fieldset>
    </form>
  );
};

export default NewsCRUDComponent;
