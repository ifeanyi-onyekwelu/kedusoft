async function uploadToCloudinary(file: File): Promise<string> {
    const url = `https://api.cloudinary.com/v1_1/dhzujlkls/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "default");
    formData.append("folder", "property-images");

    const res = await fetch(url, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    return data.secure_url;
}

export default uploadToCloudinary;