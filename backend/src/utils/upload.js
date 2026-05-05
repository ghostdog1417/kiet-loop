// Cloudinary upload placeholder - in production, use cloudinary npm package or API
async function uploadToCloudinary(fileBuffer, filename) {
  if (!process.env.CLOUDINARY_URL) {
    console.warn('Cloudinary not configured; saving to local storage placeholder')
    return { url: `/uploads/${filename}`, public_id: `local_${filename}` }
  }
  // In production:
  // const cloudinary = require('cloudinary').v2
  // const stream = cloudinary.uploader.upload_stream({ public_id: filename }, callback)
  // stream.end(fileBuffer)
  console.log('Upload to cloudinary would go here:', filename)
  return { url: `https://res.cloudinary.com/placeholder/${filename}`, public_id: filename }
}

module.exports = { uploadToCloudinary }
