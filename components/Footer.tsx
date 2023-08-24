import React from "react";

function Footer() {
  return (
    // Don't forget to set the padding-bottom to 44px of the parent so that the footer won't overlap the content at the end of the scroll.
    <div className="py-1 border-t border-t-stone-800 bg-slate-300 fixed  bottom-0 z-10 w-[100%] flex flex-col justify-center items-center">
      <h1 className="text-xs font-bold">2023 RCCC 😎</h1>
      <h2 className="text-xs text-stone-600">
        Trello Clone made in React for testing and practices purposes only.
      </h2>
      <h2 className="text-xs text-stone-600">
        For more examples, please visit my{" "}
        <a
          className="text-blue-500 underline"
          href="https://rccc-resume1.web.app/"
          target="_blank"
        >
          portfolio page
        </a>
      </h2>
    </div>
  );
}

export default Footer;
