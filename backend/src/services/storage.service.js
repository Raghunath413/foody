// ImageKit upload service (@imagekit/nodejs v7)
const imagekitModule = require("@imagekit/nodejs");

const ImageKit = imagekitModule.ImageKit || imagekitModule.default || imagekitModule;
const toFile = imagekitModule.toFile;

let client;
function getClient() {
    if (!client) {
        // v7 SDK ko upload ke liye sirf private key chahiye
        client = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });
    }
    return client;
}

/**
 * @param {Buffer} buffer   multer memoryStorage ka file.buffer
 * @param {string} fileName unique file name
 * @returns {Promise<{url: string, fileId: string}>}
 */
async function uploadFile(buffer, fileName) {
    const file = toFile ? await toFile(buffer, fileName) : buffer.toString("base64");

    const result = await getClient().files.upload({
        file,
        fileName,
        folder: "/food-view",
    });

    return { url: result.url, fileId: result.fileId };
}

async function deleteFile(fileId) {
    if (!fileId) return;
    try {
        await getClient().files.delete(fileId);
    } catch (err) {
        console.error("ImageKit delete failed:", err.message);
    }
}

module.exports = { uploadFile, deleteFile };
