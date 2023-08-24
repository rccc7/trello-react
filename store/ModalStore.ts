import {create} from 'zustand';

// Here we define the state of the modal with the help of zustand

interface ModalState{
    isOpen: boolean;
    openModal: ()=>void;
    closeModal:()=>void;
}

export const useModalStore = create<ModalState>()((set)=>({
    isOpen:false,
    openModal:()=>set({isOpen:true}),
    closeModal:()=>set({isOpen:false}),
}));