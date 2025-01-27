'use client';

import { useState } from "react";

export default function Home() {
    const[recipientName, setRecipientName]= useState("");
    const[emailPurpose, setEmailPurpose]= useState("");
    const[keyPoints, setKeyPoints] =useState("");
    const[generatedEmail, setGeneratedEmail]=useState("");
    const[loading,setLoading]=useState(false); 

    const handleSubmit= async(e)=>{
     e.preventDefault();
        setLoading(true);
        const response =await fetch('/api/generate-email',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({recipientName,emailPurpose,keyPoints })
        });
        
        const text=await response.text();
        let data;
        try{
            data=JSON.parse(text);
        }catch(error) {
            console.error('Failed to parse JSON:', error);
            setGeneratedEmail('Failed to parse response. Try again later.');
            setLoading(false);  
            return;
        }
        setGeneratedEmail(data.email || 'Failed to generate email! Try again later');
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-xl">
                <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-6">Email Template Generator</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700">Recipient Name:</label>
                      <input
                            type="text"
                            required
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700">Email Purpose:</label>
                        <select
                            value={emailPurpose}
                            required
                            onChange={(e)=>setEmailPurpose(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a Purpose</option>
                            <option value="Meeting Request">Meeting Request</option>
                            <option value="Follow Up">Follow up</option>
                            <option value="Thank you">Thank you</option>
                        </select>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700">Key Points:</label>
                      <textarea
                            value={keyPoints}
                            onChange={(e)=>setKeyPoints(e.target.value)}
                            required
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold text-lg rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    Generate Email
                    </button>
                </form>
            </div>

            {loading && (
                <div className="mt-6 text-center text-white p-6">
                    <svg
                        className="animate-spin w-8 h-8 mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                        ></path>
                    </svg>
                    <p>Generating Email...</p>
                </div>
            )}

            {generatedEmail && !loading && (
                <div className="mt-6 w-full max-w-xl mx-auto">
                    <div className="bg-indigo-50 p-6 rounded-md shadow-lg">
                        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Generated Email:</h2>
                        <p className="text-gray-800">{generatedEmail}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
