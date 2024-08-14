"use client";
import React, { useState, useEffect, useRef } from "react";
import { PiWarningCircleLight } from "react-icons/pi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Column } from "primereact/column";
import { UseFetchComments } from "@/features/comments/UseFetchComments";
import { UseFetchCommentsSearch } from "@/features/comments/UseSearchComments";
import { UseDeleteComment } from "@/features/comments/UseDeleteComment";
import { UseCreateComment } from "@/features/comments/UseCreateComment";
import { useStore } from "@/store/useStore";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Toast } from 'primereact/toast';
import { debounce } from "radash";

function TableView() {

  const toast = useRef(null);
  const { keyword, setKeyword } = useStore();
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const { dataComments, isLoadingComments, refetchComments } =
    UseFetchComments();

  const { dataCommentsSearch, isLoadingCommentsSearch } =
    UseFetchCommentsSearch();

  const { mutate: deleteComment } = UseDeleteComment({
    onSuccess: () => {
      refetchComments();
    },
  });

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setVisibleDelete(true);
  };

  const confirmDelete = (id) => {
    console.log("Deleting item with id:", id);
    deleteComment(id);
    setVisibleDelete(false);

    toast.current.show({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Check the network to see if delete was successful.', 
      life: 3000 
  });
  
  };

  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      email: "",
      body: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      body: Yup.string().required("Body is required"),
    }),
    onSubmit: (values) => {
      const { name, email, body } = formik.values;

      //post
      createComment({name, email, body});
      setVisible(false)
      formik.setFieldValue("id", "")
      formik.setFieldValue("name", "")
      formik.setFieldValue("email", "")
      formik.setFieldValue("body", "")
    
      toast.current.show({ severity: 'success', summary: 'success', detail: 'Check the network to see created was successful.', life: 3000 })
    },
  });

  const handleFormInput = (event) => {
    formik.setFieldValue(event.target.name, event.target.value)
  }

  const {mutate: createComment, isLoading: isLoadingCreate} = UseCreateComment({
    onSuccess: () => {
      refetchComments()
    }
  })

  return (
    <div className="md:px-[41px] px-5 pt-[33px] mb-5">
       <Toast ref={toast} />
      <div className="flex flex-row justify-between items-center mb-3 md:text-[13px] text-xs">
        <div className="font-bold text-[20px]">Detail Comments</div>
        <button
          onClick={() => setVisible(true)}
          className="md:px-[20px] px-5 md:text-[13px] text-xs font-semibold shadow-md md:py-[11px] py-1 rounded-xl bg-[#0016DF] text-white"
        >
          Create
        </button>
        <Dialog
          visible={visible}
          modal
          draggable={false}
          className="md:w-1/2 md:h-4/5"
          // style={{ width: "50%", height: "80%" }}
          onHide={() => {
            if (!visible) return;
            setVisible(false);
          }}
        >
          <form className=" font-semibold w-full h-full flex flex-col justify-between" onSubmit={formik.handleSubmit}>
            <div>
              <div className=" text-[24px] mb-4 pt-5 md:pt-0">Create Comment</div>
              <div className=" w-full  h-[105px] relative">
                <div className="text-[16px] mb-2">Name</div>
                <input
                name="name"
                onChange={handleFormInput}
                 value={formik.values.name}
                  placeholder="...."
                  className="border border-[#EAEAEA] text-[15px] mb-[22px] rounded-[10px] px-[16px] pt-[13px] pb-[11px] w-full shadow-md "
                />
                 {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-xs absolute bottom-1">{formik.errors.name}</div>
                ) : null}
              </div>

              <div className=" w-full h-[105px] relative">
                <div className="text-[16px] mb-2 ">Email</div>
                <input
                type="email"
                name="email"
                 onChange={handleFormInput}
                value={formik.values.email}
                  placeholder="...."
                  className="border border-[#EAEAEA] text-[15px] mb-[22px] rounded-[10px] px-[16px] pt-[13px] pb-[11px] w-full shadow-md "
                />
                 {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-xs absolute bottom-1">{formik.errors.email}</div>
                ) : null}
              </div>

              <div className=" w-full  relative  h-[137px] ">
                <div className="text-[16px] mb-2">Body</div>
                <textarea
                name="body"
                 onChange={handleFormInput}
                 value={formik.values.body}
                  placeholder="...."
                  className="border border-[#EAEAEA] text-[15px] mb-[22px] rounded-[10px] px-[16px] pt-[15px] pb-[13px] w-full shadow-md "
                />
                {formik.touched.body && formik.errors.body ? (
                  <div className="text-red-500 text-xs absolute bottom-2">{formik.errors.body}</div>
                ) : null}
              </div>
            </div>

            <div className="w-full  flex-row flex justify-end gap-2">

            
            <button
              onClick={() => setVisible(false)}
              className="w-1/2 border border-[#EAEAEA] py-1 shadow-sm rounded-md"
            >
              Cancel
            </button>
            <button
             disabled={isLoadingCreate}
              className="w-1/2  py-1 shadow-sm text-white rounded-md bg-[#0016DF]"
            >
              Create
            </button>
   
            </div>
          </form>
        </Dialog>
      </div>

      <div className=" w-full flex justify-end mb-5">
        <input
          defaultValue={keyword}
          onChange={debounce({delay:1000}, (e) => {
            setKeyword(e.target.value.trim());
          })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setKeyword(e.target.value.trim());
            }
          }}
          className="border border-[#EAEAEA] md:w-60 w-32  px-3 md:py-2 py-1 text-xs rounded-md"
          placeholder="search...."
        />
      </div>



      <DataTable
        value={keyword === "" ? dataComments : dataCommentsSearch}
        loading={keyword === "" ? isLoadingComments : isLoadingCommentsSearch}
        size="small"
        showGridlines
        tableStyle={{ minWidth: "50rem" }}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
      >
        <Column field="id" header="Id"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="body" header="Body"></Column>

        <Column
          body={(rowData) => (
            <button
              className="border px-5 py-2 rounded-md bg-red-500 text-white shadow-sm"
              onClick={() => openDeleteModal(rowData.id)}
            >
              {" "}
              <RiDeleteBin5Fill size={15} className="text-white" />
            </button>
          )}
          header="Actions"
          style={{ width: "8rem" }}
        />
      </DataTable>
      <Dialog
        visible={visibleDelete}
        modal
        draggable={false}
        style={{ width: "25rem" }}
        onHide={() => setVisibleDelete(false)}
      >
        <div className="w-full   flex flex-col justify-between items-center ">
          <div className="flex  items-center justify-center bg-red-100 rounded-full w-14 h-14 mb-2 ">
            <PiWarningCircleLight className="text-red-600" size={35} />
          </div>

          <div className=" text-center font-normal text-xs px-5 mb-10">
            Are you sure want to delete this comment? This action cannot be
            undone.
          </div>
          <div className="flex flex-row w-full gap-2">
            <button
              onClick={() => setVisibleDelete(false)}
              className="w-1/2 border border-[#EAEAEA] py-1 shadow-sm rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => confirmDelete(deleteId)}
              className="w-1/2  py-1 shadow-sm text-white rounded-md bg-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default TableView;
