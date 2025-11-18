# 🎭 Gesture Meme Tracker

Real-time hand gesture detection with meme display using MediaPipe!

## 🌐 Two Versions Available

### 🖥️ **Desktop Version** (Python + OpenCV)
Run locally on your computer with a native window

### 🌍 **Web Version** (JavaScript) ⭐ NEW!
Works in any browser, deploy to the internet, accessible anywhere!

## 🚀 Features

- **Real-time hand gesture detection** using MediaPipe Hands & Face Mesh
- **8 recognizable gestures**:
  - 😂 **JIJIJA** - Just laugh (mouth open)
  - 🤐 **MIMIMI** - Both hands closed (fists)
  - ⚖️ **SIXSEVEN** - Balance pose (hands extended wide)
  - 🤫 **CERRAO** - One finger up (index finger)
  - ⏸️ **TIMEOUT** - T-shape gesture (one hand horizontal, other vertical)
  - 🤔 **THINKING** - Index finger on chin/lip (thinking pose)
  - ✌️ **PEACE** - Peace sign (V-sign with index and middle fingers)
  - 👌 **DEFAULT** - Neutral state
- **Dynamic meme display** - shows different meme videos/images for each gesture
- **Side-by-side view** - webcam feed and meme displayed together
- **Modern UI** - Clean, light theme with Geist fonts
- **Beginner-friendly** - fully commented and easy to understand

---

# 🌍 Web Version (Recommended)

## 🎯 Live Demo
Once deployed, your app will be accessible from any device with a browser!

## ⚡ Quick Deploy

### Deploy to Vercel (Easiest!)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add web version"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `gesture-meme-tracker-1` repository
   - Click "Deploy" (that's it!)
   - Your site will be live at `https://your-project.vercel.app`

### Deploy to GitHub Pages

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main`, folder: `/ (root)`
   - Save

2. **Access your site:**
   - Your site will be live at `https://yourusername.github.io/gesture-meme-tracker-1`

## 💻 Local Testing (Web Version)

You can test the web version locally:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000` in your browser.

## 📋 Web Version Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Webcam
- HTTPS connection (required for camera access - automatically handled by Vercel/GitHub Pages)

## 🛠️ JavaScript/Web Setup

### Local Development Setup

1. **Clone or download this repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gesture-meme-tracker.git
   cd gesture-meme-tracker
   ```

2. **No build step required!** 
   - The web version uses CDN-hosted MediaPipe libraries
   - No npm, webpack, or build tools needed
   - Pure vanilla JavaScript

3. **File Structure:**
   ```
   gesture-meme-tracker/
   ├── index.html       # Main HTML file
   ├── style.css        # Styling
   ├── script.js        # JavaScript logic
   ├── images/          # Meme videos/images folder
   └── vercel.json      # Vercel config
   ```

4. **Run Locally:**
   ```bash
   # Option 1: Python HTTP server
   python -m http.server 8000
   
   # Option 2: Node.js (if installed)
   npx http-server -p 8000
   
   # Option 3: VS Code Live Server extension
   # Right-click index.html → "Open with Live Server"
   ```

5. **Open in Browser:**
   - Navigate to `http://localhost:8000`
   - **Note:** Camera won't work on `localhost` without HTTPS
   - For camera testing, deploy to Vercel or use a local HTTPS setup

### Web Version Dependencies

The web version uses CDN-hosted libraries (no installation needed):

- **MediaPipe Hands** - Hand gesture detection
- **MediaPipe Face Mesh** - Face detection for JIJIJA gesture
- **MediaPipe Camera Utils** - Webcam access
- **MediaPipe Drawing Utils** - Visual feedback

All libraries are loaded from `cdn.jsdelivr.net` in `index.html`.

---

# 🖥️ Desktop Version (Python)

## 📋 Requirements

- Python 3.7 or higher
- Webcam
- Required packages (see requirements.txt)

## 🔧 Installation

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Add meme images:**
      - (these will change) 
   - Create an `images` folder in the same directory as the script (it will be created automatically if it doesn't exist)
   - Add the following image files:
     - `JIJIJA.mp4` - Laughing royale
     - `CERRAO.mp4` - Crazy jawline
     - `MIMIMI.mp4` - Goblin crying
     - `SIXSEVEN.mp4` - 6 7 
     - `default.jpg` - shown when no gesture detected

   **Note:** You can use `.jpg`, `.png`, or `.jpeg` formats (update filenames in code accordingly)

## 🎮 Usage (Desktop Version)

Run the script:
```bash
python gesture_meme_tracker.py
```

- **Show gestures** to the webcam to see corresponding memes
- **Press 'q'** to quit the application

---

## 🖐️ How Gestures Are Detected

Both versions use MediaPipe's hand landmarks (21 points per hand) and face mesh to identify gestures:

- 😂 **JIJIJA** - Detects open mouth (laughing expression)
- 🤐 **MIMIMI** - Both hands with all fingers closed (fists)
- ⚖️ **SIXSEVEN** - Both hands with open palms spread apart horizontally
- 🤫 **CERRAO** - One hand with only the index finger extended
- ⏸️ **TIMEOUT** - T-shape with one hand horizontal and the other vertical touching it
- 🤔 **THINKING** - Index finger extended and touching chin/lip area
- ✌️ **PEACE** - Index and middle fingers extended (V-sign), ring and pinky closed
- 👌 **DEFAULT** - Any other hand position or no hands detected

## 🎨 Customization

### Web Version
Edit these files:
- `script.js` - Add gesture logic in `detectGesture()` function
- `GESTURE_MEMES` object - Change meme file mappings
- `style.css` - Customize appearance

### Desktop Version (Python)
1. **Add more gestures**: Edit `detect_gesture()` function in `gesture_meme_tracker.py`
2. **Change meme mappings**: Modify the `GESTURE_MEMES` dictionary
3. **Adjust detection sensitivity**: Change `min_detection_confidence` and `min_tracking_confidence`

## 📝 Tips for Best Results

- Ensure good lighting
- Position your hand clearly in front of the camera
- Keep your hand at a reasonable distance (about 30-60cm from camera)
- Make gestures distinct and clear

## 🐛 Troubleshooting

### Web Version

**Camera not working?**
- Allow camera permissions when prompted by the browser
- Make sure you're using HTTPS (Vercel/GitHub Pages automatically provide this)
- Check if another tab/app is using the webcam
- Try a different browser (Chrome works best)

**Site not loading meme videos?**
- Make sure the `images` folder is committed to your Git repository
- Check browser console (F12) for errors
- Videos must be in `.mp4` or `.webm` format

**Gestures not being detected?**
- Ensure good lighting
- Keep your hand(s) clearly visible and at a reasonable distance
- Make gestures distinct and deliberate
- Check if face is visible for JIJIJA gesture (laughing)

**Deployment issues?**
- Ensure all files (HTML, CSS, JS, images folder) are pushed to GitHub
- For Vercel: Check build logs for errors
- For GitHub Pages: Make sure Pages is enabled in repository settings

### Desktop Version (Python)

**"No module named 'cv2'" or package import errors?**
- You likely have multiple Python installations
- Use the launcher script: `./run.sh`
- Or use the full Python path: `/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 gesture_meme_tracker.py`
- Check which Python: `which python` and `which pip`

**Webcam not opening?**
- **macOS**: Grant camera permission in System Settings → Privacy & Security → Camera
- Check if another application is using the webcam
- Try changing `cv2.VideoCapture(0)` to `cv2.VideoCapture(1)` in the code

**Gestures not being detected?**
- Ensure your full hand is visible in the frame
- Try adjusting lighting conditions
- Make gestures more distinct

**Missing meme images?**
- The script will create colored placeholder images if meme files are not found
- Add your own meme images to the `images` folder

## 📁 Project Structure

```
gesture-meme-tracker/
├── index.html              # Web app main page
├── style.css               # Web app styling
├── script.js               # Web app JavaScript (MediaPipe Web)
├── vercel.json             # Vercel deployment config
├── gesture_meme_tracker.py # Desktop Python version
├── requirements.txt        # Python dependencies
├── run.sh                  # Python launcher script
├── images/                 # Meme videos and images
│   ├── JIJIJA.mp4          # Laughing gesture
│   ├── MIMIMI.mp4          # Fists gesture
│   ├── SIXSEVEN.mp4        # Balance pose gesture
│   ├── CERRAO.mp4          # One finger gesture
│   ├── open_palm.jpg       # Timeout gesture
│   ├── thumbs_up.jpg       # Thinking gesture
│   ├── peace.jpg           # Peace sign gesture
│   ├── ok_sign.jpg         # Default/neutral gesture
│   └── ...                 # Other meme files
├── venv/                   # Python virtual environment (local only)
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🌟 Deployment Checklist

- [ ] All meme files are in the `images/` folder
- [ ] Files committed to Git: `git add . && git commit -m "Ready to deploy"`
- [ ] Pushed to GitHub: `git push origin main`
- [ ] Deployed to Vercel or GitHub Pages
- [ ] Tested on different devices (desktop, mobile, tablet)
- [ ] Camera permissions working correctly

---

## 🤝 Contributing

### Adding More Memes

Want to add your own memes? Here's how:

#### Step 1: Add Your Meme File

1. **Add your meme to the `images/` folder:**
   ```bash
   # Copy your meme file to the images folder
   cp /path/to/your/meme.mp4 images/your_meme_name.mp4
   # OR for images:
   cp /path/to/your/meme.jpg images/your_meme_name.jpg
   ```

2. **Supported formats:**
   - Videos: `.mp4`, `.webm`, `.mov`
   - Images: `.jpg`, `.jpeg`, `.png`, `.gif`

#### Step 2: Add Gesture Detection (Optional)

If you want to create a new gesture:

**For Web Version (`script.js`):**

1. **Add your gesture to the `GESTURE_MEMES` object:**
   ```javascript
   const GESTURE_MEMES = {
       // ... existing gestures ...
       "your_gesture": "images/your_meme_name.mp4",
   };
   ```

2. **Add detection logic in `detectGesture()` function:**
   ```javascript
   function detectGesture(handLandmarks, allHands, faceLandmarks) {
       // ... existing detection code ...
       
       // YOUR NEW GESTURE
       if (numExtended === 2 && extendedFingers.includes("index") && extendedFingers.includes("middle")) {
           // Check if other fingers are closed
           if (!ringExtended && !pinkyExtended) {
               return "your_gesture";
           }
       }
       
       return "none";
   }
   ```

3. **Update `index.html` to show your gesture in the guide:**
   ```html
   <div class="gesture-item">
       <span class="emoji">✌️</span>
       <strong>YOUR_GESTURE</strong>
       <p>Description of gesture</p>
   </div>
   ```

**For Desktop Version (`gesture_meme_tracker.py`):**

1. **Add to `GESTURE_MEMES` dictionary:**
   ```python
   GESTURE_MEMES = {
       # ... existing gestures ...
       "your_gesture": "your_meme_name.mp4",
   }
   ```

2. **Add detection logic in `detect_gesture()` function:**
   ```python
   def detect_gesture(hand_landmarks, all_hands=None, face_landmarks=None):
       # ... existing code ...
       
       # YOUR NEW GESTURE
       if num_extended == 2 and "index" in extended_fingers and "middle" in extended_fingers:
           ring_extended = is_finger_extended(16, 14, 13)
           pinky_extended = is_finger_extended(20, 18, 17)
           if not ring_extended and not pinky_extended:
               return "your_gesture"
       
       return "none"
   ```

3. **Update the help text in `main()` function**

#### Step 3: Test Your Changes

1. **Test locally:**
   ```bash
   # Web version
   python -m http.server 8000
   
   # Desktop version
   python gesture_meme_tracker.py
   ```

2. **Make the gesture and verify the meme appears**

#### Step 4: Commit and Share

```bash
git add images/your_meme_name.mp4 script.js gesture_meme_tracker.py index.html
git commit -m "Add new meme: your_gesture"
git push origin main
```

### Adding More Gestures

To add a completely new gesture:

1. **Understand MediaPipe landmarks:**
   - Each hand has 21 landmarks
   - Index finger: tip=8, PIP=6, MCP=5
   - Middle finger: tip=12, PIP=10, MCP=9
   - Ring finger: tip=16, PIP=14, MCP=13
   - Pinky: tip=20, PIP=18, MCP=17
   - Wrist: 0

2. **Check existing gestures** in `script.js` or `gesture_meme_tracker.py` for reference

3. **Add your detection logic** following the pattern above

4. **Test thoroughly** with different hand positions and lighting

### Meme Guidelines

- **Videos:** Keep file sizes reasonable (< 5MB recommended for web performance)
- **Images:** Use `.jpg` for photos, `.png` for graphics with transparency
- **Naming:** Use lowercase with underscores (e.g., `thumbs_up.jpg`)
- **Content:** Keep it appropriate and fun!

### Pull Requests

1. Fork the repository
2. Create a branch: `git checkout -b add-new-meme`
3. Add your meme and code changes
4. Commit: `git commit -m "Add: Description of what you added"`
5. Push: `git push origin add-new-meme`
6. Open a Pull Request on GitHub

---

## 📄 License

Free to use and modify for educational purposes!

---

**Gesture Meme Tracker** - Made with ❤️ using MediaPipe, JavaScript, Python, and OpenCV

🌐 **Web Version:** Runs entirely in your browser  
🖥️ **Desktop Version:** Native Python application

