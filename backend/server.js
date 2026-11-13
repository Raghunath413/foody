require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

// Local par server khud chalega; Vercel par ye function ki tarah chalega
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
