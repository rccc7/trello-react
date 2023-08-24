"use client";
import { useState, Fragment, useRef, FormEvent } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";
// This component was made based on the example at headlessui documentation to create modals with
// transitions to animate the opening/closing of the dialog at: https://headlessui.com/react/dialog#transitions
// For more info on hoy to style the dialog head over to https://headlessui.com/react/dialog#styling-the-dialog
// Based specifically on the example "To animate your backdrop and panel separately..."
// Important: This modal must be rendered at the top level of the components that is in the layout.tsx file

function Modal() {
  // We'll use the imagePicker referecene to click to the hidden input
  const imagePickerRef = useRef<HTMLInputElement>(null);
  // In this component we are not going to use useState. Instead we're going to use zustand's globla state.
  //   let [isOpen, setIsOpen] = useState(true);

  //   With these variables we are going to keep track of the ModalStore.
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);

  const [addTask, image, setImage, newTaskInput, setNewTaskInput, newTaskType] =
    useBoardStore((state) => [
      state.addTask,
      state.image,
      state.setImage,
      state.newTaskInput,
      state.setNewTaskInput,
      state.newTaskType,
    ]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;
    console.log("Submitting creating a new task...");

    // add task to board...
    addTask(newTaskInput, newTaskType, image);
    setImage(null);
    closeModal();
  };

  return (
    // Use the `Transition` component at the root level
    // as={Fragment} means it is going to render as a fragment <>...</>
    <Transition appear show={isOpen} as={Fragment}>
      {/* as="form" -->this is going to render as a form */}
      <Dialog
        as="form"
        onSubmit={handleSubmit} //this will occur when the user clics on the "Add Task" button.
        className="relative z-10"
        onClose={closeModal}
      >
        {/*
          Use one Transition.Child to apply one transition to the backdrop...
        */}
        {/* This transition child is for the backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-25" />
        </Transition.Child>
        {/* this second transitionChild is for the container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 
              text-left align-middle shadow-xl transition-all"
              >
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a Task
                </Dialog.Title>
                <div>
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Enter a task here..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                  />
                </div>
                {/* RadioGroup */}
                <TaskTypeRadioGroup />
                <div className="mt-2">
                  <button
                    type="button" //if we don't specify that this button's type is button then it'll automatically submit and reload the page because by default its type is "submit"
                    className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2
                   focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      // When this button is clicked, then automatically the hidden image will be clicked by
                      // calling its reference's onClick event.
                      imagePickerRef.current?.click();
                    }}
                  >
                    <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                    Upload Image
                  </button>
                  {image && (
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="Image that represents the task"
                      height={200}
                      width={200}
                      className="w-full h-44 object-cover mt-2 filter hover:grayscale
                        transition-all duration-150 cursor-not-allowed"
                      onClick={() => {
                        setImage(null);
                      }}
                    />
                  )}
                  <input
                    type="file"
                    // Here, we use the reference to click the hidden input.
                    ref={imagePickerRef}
                    hidden
                    onChange={(e) => {
                      // check e is an image
                      if (!e.target.files![0].type.startsWith("image/")) return;
                      setImage(e.target.files![0]);
                    }}
                  />
                </div>
                <div className="mt-5">
                  <button
                    type="submit"
                    disabled={!newTaskInput} //it'll be disabled if we don't have a task input
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2
                  text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2
                  focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300
                  disabled:cursor-not-allowed"
                  >
                    Add Task
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
