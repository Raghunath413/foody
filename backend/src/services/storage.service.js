// ImageKit service
//
// Video ab browser se SEEDHA ImageKit par upload hoti hai (Vercel functions
// 4.5 MB se badi request accept nahi karte). Backend sirf ek short-lived
// signature deta hai, taaki private key kabhi frontend tak na jaaye.
const crypto = require("crypto");
const imagekitModule = require("@imagekit/nodejs");

const ImageKit = imagekitModule.ImageKit || imagekitModule.default || imagekitModule;

let client;
function getClient() {
    if (!client) client = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });
    return client;
}

// ImageKit client-side upload ke liye auth params
// signature = HMAC-SHA1(privateKey, token + expire)
function getUploadAuth() {
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 30 * 60; // 30 min (1 ghante se kam hona chahiye)
    const signature = crypto
        .createHmac("sha1", process.env.IMAGEKIT_PRIVATE_KEY)
        .update(token + expire)
        .digest("hex");

    return { token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY };
}

// Check ki URL sach me hamare ImageKit account ka hai
function isOwnImageKitUrl(url) {
    const endpoint = (process.env.IMAGEKIT_URL_ENDPOINT || "").replace(/\/+$/, "");
    return typeof url === "string" && endpoint && url.startsWith(endpoint + "/");
}

async function deleteFile(fileId) {
    if (!fileId) return;
    try {
        await getClient().files.delete(fileId);
    } catch (err) {
        console.error("ImageKit delete failed:", err.message);
    }
}

module.exports = { getUploadAuth, isOwnImageKitUrl, deleteFile };
