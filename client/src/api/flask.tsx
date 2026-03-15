// Remove the import from main - we'll use environment directly
import { DBLink } from "../main";

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

        const result = await response.json();
        return result;
    }
    catch (err) {
        console.error("Error fetching /hello:", err);
        return ""
    }
}

export async function analyzeStrokeImage(formData: FormData): Promise<any> {
    try {
        console.log("Sending to:", `${DBLink}/analyze-stroke`);
        const response = await fetch(`${DBLink}/analyze-stroke`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }   

        const result = await response.json();
        console.log("✅ Stroke analysis result:", result);
        return result;
    }
    catch (err) {
        console.error("❌ Error in stroke analysis:", err);
        throw err;
    }
}
