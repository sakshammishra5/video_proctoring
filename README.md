# 📹 SecureView – AI-Powered Video Proctoring System

SecureView is a real-time video proctoring application built with **Next.js**, **Jitsi**, **TensorFlow.js**, and **MongoDB**.  
It enables interviewers to conduct secure online interviews while monitoring candidates for focus and suspicious activities.

## 🌐 Live Demo

**🔗 [Try SecureView Live](https://video-proctoring-two.vercel.app/)**

Experience the full functionality of the AI-powered video proctoring system with real-time monitoring and reporting features.

---

## 🚀 Features

- 🔗 **Video Conferencing** – Powered by Jitsi Meet (`@jitsi/react-sdk`)  
- 👀 **Focus Detection** – Detects when candidate looks away or leaves screen  
- 📱 **Suspicious Item Detection** – Detects phones, books, and multiple faces  
- 📝 **Event Logging** – All suspicious activities are logged with timestamps in MongoDB  
- 📑 **Proctoring Reports**  
  - Candidate Name  
  - Duration  
  - Focus Lost Count  
  - Suspicious Events  
  - Final Integrity Score  
  - Downloadable as PDF  

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 13 (App Router), TailwindCSS  
- **Video**: Jitsi (`@jitsi/react-sdk`)  
- **AI Models**: TensorFlow.js (`@tensorflow-models/face-landmarks-detection`, `@tensorflow-models/coco-ssd`)  
- **Database**: MongoDB (Atlas or local)  
- **Reports**: `@react-pdf/renderer`  

---

## 📂 Project Structure

```
app/
├── api/                    # API routes
│   ├── logs/              # Store candidate logs
│   └── reports/           # Generate reports (JSON + PDF)
├── candidate/             # Candidate flow (join + interview room)
├── interviewer/           # Interviewer flow (join + report page)
├── components/            # Shared components (Jitsi, Proctoring)
└── page.js               # Home page
lib/
└── mongodb.js            # MongoDB connection helper
utils/
└── roomGenerator.js      # Utility for random room IDs
```

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/sakshammishra5/video_proctoring.git
cd video_proctoring
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database-name>
MONGODB_DB=proctoring_db
NEXT_PUBLIC_JITSI_DOMAIN=meet.jit.si
```

### 4️⃣ Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5️⃣ Build for production
```bash
npm run build
npm start
```

---

## 🖥️ Usage

1. **Home Page** → Choose to join as **Candidate** or **Interviewer**
2. **Candidate** → Enter details → Join interview → Video monitored by AI
3. **Interviewer** → View candidate video + suspicious activity logs in real-time
4. **Report** → After session, interviewer can view/download PDF report with integrity score

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^13.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@jitsi/react-sdk": "latest",
    "@tensorflow/tfjs": "latest",
    "@tensorflow-models/face-landmarks-detection": "latest",
    "@tensorflow-models/coco-ssd": "latest",
    "mongodb": "^6.0.0",
    "@react-pdf/renderer": "latest",
    "tailwindcss": "^3.0.0"
  }
}
```

---

## 🔧 Configuration

### MongoDB Setup
1. Create a MongoDB Atlas account or use local MongoDB
2. Create a database named `proctoring_db`
3. Collections will be auto-created: `logs`, `reports`

### Jitsi Configuration
- Default domain: `meet.jit.si` (free)
- For custom domain, update `NEXT_PUBLIC_JITSI_DOMAIN` in `.env.local`

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Other Platforms
- **Netlify**: Connect GitHub repo and deploy
- **Railway**: One-click deploy with MongoDB addon
- **Docker**: Build container and deploy anywhere

---

## 📊 AI Models Used

- **Face Landmarks Detection**: Tracks eye movement and head position
- **COCO-SSD Object Detection**: Detects phones, books, laptops, and multiple people
- **Real-time Processing**: 30 FPS analysis with minimal performance impact

---

## 🔒 Privacy & Security

- No video recordings stored permanently
- Only metadata and timestamps logged
- GDPR compliant event logging
- Secure MongoDB connection with authentication

---

## 🐛 Troubleshooting

### Common Issues
1. **Camera not working**: Ensure browser permissions are granted
2. **MongoDB connection failed**: Verify connection string in `.env.local`
3. **AI models loading slowly**: Check internet connection and TensorFlow.js CDN

### Performance Optimization
- Use Chrome/Edge for better WebGL support
- Ensure good lighting for accurate face detection
- Close unnecessary browser tabs during sessions

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Saksham Mishra**
- 🌐 GitHub: [@sakshammishra5](https://github.com/sakshammishra5)
- 🚀 Live Demo: [video-proctoring-two.vercel.app](https://video-proctoring-two.vercel.app/)

---

## 📞 Support

For questions or issues:
- 🐛 Issues: [GitHub Issues](https://github.com/sakshammishra5/video_proctoring/issues)


---

<div align="center">
  <strong>Built with ❤️ using Next.js and TensorFlow.js</strong>
</div>