import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function handleApiResponse(response) {
    const data=await response.json();
    if (response.status!==200){
        console.error('API responded with error status:',response.status);
        console.error('Response data:',data);
        throw new Error(`Failed to generate email, error with status:${response.status}`);
    }

    if(!data|| !data[0]?.generated_text){
        console.error('Received invalid or empty response:',data);
        throw new Error("Failed to generate email.");
    }
    return data[0].generated_text;
}

export async function POST(req) {
    const { recipientName, emailPurpose, keyPoints } = await req.json();
    if (!recipientName || !emailPurpose || !keyPoints) {
        return new Response(JSON.stringify({error:"Invalid input" }),{status:400});
    }
    const prompt=`Write a professional email for the following details:
    Recipient: ${recipientName}
    Purpose: ${emailPurpose}
        Key Points: ${keyPoints}`;

    const url='https://api-inference.huggingface.co/models/gpt2';
    const headers = {
        'Authorization':`Bearer ${process.env.HUGGING_FACE_API_KEY}`,  
        'Content-Type':'application/json',
    };

    const body=JSON.stringify({
        inputs:prompt,
    });

    try {
       
        console.log("Sending request to Hugging Face API with prompt:", prompt);

        const response= await fetch(url,{
            method:'POST',
            headers:headers,
            body:body,
        });

        const generatedEmail= await handleApiResponse(response);

        console.log("Generated email:", generatedEmail);

        return new Response(JSON.stringify({email:generatedEmail}),{status:200});
    } catch (error){
        console.error("Error while generating email:", error);
        return new Response(JSON.stringify({ error: error.message }),{status:500});
    }
}
