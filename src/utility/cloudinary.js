export const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file
    )
    formData.append('upload_preset', 'Free Public Upload')

    try {
        const res = await fetch('https://api.cloudinary.com/v1_1/defv6c81f/image/upload', {
            method: 'POST',
            body: formData
        })

        if (!res.ok) {
            throw new Error('Failed to upload image')
        }

        const data = await res.json()
        return data.secure_url

    } catch (err) {
        console.error(err)
        throw err
    }
}
