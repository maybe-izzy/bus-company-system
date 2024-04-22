import React from "react";

function EmailSent() {
  const email = localStorage.getItem("email");
  return (
    <div className="bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-100 h-screen flex items-center justify-center p-12 py-6">
      <div className="flex flex-col px-24 py-12 rounded-2xl bg-black bg-opacity-75">
        <div className="grid gap-5 md:grid-cols-2 md:gap-10 lg:gap-20">
     
          <div className="flex items-center">
            <div className="mx-auto md:mx-0">
              <h3 className="text-3xl font-bold text-white">
                Email Sent Successfully
              </h3>
              <p className="mt-2 max-w-[20rem] text-lg text-white/80">
                Check your email for a link to reset your password. 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailSent;
