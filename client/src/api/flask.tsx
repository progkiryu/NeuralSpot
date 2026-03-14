// Remove the import from main - we'll use environment directly
const API_BASE = import.meta.env.VITE_DEV_ADDR || '';

export async function fetchHello(): Promise<string> {
    try {
        const response = await fetch(`${API_BASE}/hello`, {
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

export async function analyzeStrokeImage(formData: FormData) {
    try {
        console.log("Sending to:", `${API_BASE}/analyze-stroke`);
        const response = await fetch(`${API_BASE}/analyze-stroke`, {
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
