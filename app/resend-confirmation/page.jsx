"use client";
import { resendConfirmation } from "@/lib/auth";
import { useState } from "react";

const Page=()=>{
   const [email, setEmail] = useState("");
   const [message, setMessage] = useState("");
   const [isProcessing, setIsProcessing] = useState(false);

   const handleResend = async () => {
       setIsProcessing(true);
       
       const { error } = await resendConfirmation(email);
       if (error) {
           setMessage(error);
       } else {
           setMessage("Confirmation email resent successfully!");
       }
       setIsProcessing(false);
   };

    return (
        <div className="flex flex-col items-center justify-center text-black min-h-screen ">
            <h1 className="text-2xl text-white font-bold mb-2">Resend Confirmation</h1>
           <div className="p-6 flex items-center justify-center">
            <input type="text" className="border-2 p-3 rounded-lg text-gray-100" name="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <button onClick={handleResend} disabled={isProcessing} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg">{isProcessing ? "Resending..." : "Resend"}</button>
            </div>
            <p className="text-blue-300 mb-6">{message}</p>
            <a href="/signin" className="text-blue-300 hover:underline">Back to Sign In</a>
        </div>
    );
}

export default Page;
