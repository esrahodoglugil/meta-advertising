const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("✅ MongoDB bağlantısı başarılı");
})
.catch((err) => {
  console.error("❌ MongoDB bağlantı hatası:", err.message);
  console.error("Stack trace:", err.stack);
});

module.exports = mongoose; 