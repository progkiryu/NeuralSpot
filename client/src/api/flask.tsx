import { DBLink } from '../main';

export async function fetchHello(): Promise<string> {
    try {
        const response = await fetch(`${DBLink}/hello`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = response.json();
        return result;
    }
    catch (err) {
        console.error("Error fetching /hello:", err);
        return ""
    }
}

export async function sendPhotoFile(formData: FormData): Promise<void> {
    try {
        const response = await fetch(`${DBLink}/photo`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }   

        console.log("Success fetching POST /photo")
    }
    catch (err) {
        console.error("Error fetching POST /photo:", err);
    }
}