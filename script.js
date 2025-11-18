// Gesture Meme Tracker - JavaScript Implementation
// Uses MediaPipe Hands and Face Mesh for gesture detection

// Gesture to meme mapping
const GESTURE_MEMES = {
    "jijija": "images/JIJIJA.mp4",
    "mimimi": "images/MIMIMI.mp4",
    "sixseven": "images/SIXSEVEN.mp4",
    "cerrao": "images/CERRAO.mp4",
    "timeout": "images/open_palm.jpg",
    "thinking": "images/thumbs_up.jpg",
    "peace": "images/peace.jpg",
    "none": "images/ok_sign.jpg"
};

// Global variables
let camera = null;
let hands = null;
let faceMesh = null;
let currentGesture = "none";
let lastGesture = "none";
let fpsInterval, startTime, now, then, elapsed;
let fpsCounter = 0;

// DOM Elements
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');
const gestureLabelElement = document.getElementById('gestureLabel');
const memeVideoElement = document.getElementById('memeVideo');
const memeImageElement = document.getElementById('memeImage');
const loadingElement = document.getElementById('loading');
const startButton = document.getElementById('startButton');
const statusText = document.getElementById('statusText');
const statusSubtext = document.getElementById('statusSubtext');
const statusProgress = document.getElementById('statusProgress');

// Debug elements
const debugInfo = document.getElementById('debugInfo');
const fpsElement = document.getElementById('fps');
const handsCountElement = document.getElementById('handsCount');
const faceDetectedElement = document.getElementById('faceDetected');
const mouthHeightElement = document.getElementById('mouthHeight');
const mouthWidthElement = document.getElementById('mouthWidth');

// Enable debug mode to see detection info
debugInfo.style.display = 'block';

/**
 * Update status indicator
 */
function updateStatus(text, progress, subtext) {
    if (statusText) statusText.textContent = text;
    if (statusProgress) statusProgress.style.width = progress + '%';
    if (statusSubtext && subtext) statusSubtext.textContent = subtext;
}

/**
 * Initialize MediaPipe Hands
 */
function initHands() {
    updateStatus('⏳ Loading hand detection model...', 30, 'Downloading MediaPipe Hands (~2MB)');
    
    hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);
    
    // Simulate progress (MediaPipe loads async)
    setTimeout(() => {
        updateStatus('✅ Hand detection loaded!', 50, 'Loading face detection...');
    }, 500);
}

/**
 * Initialize MediaPipe Face Mesh
 */
let storedFaceLandmarks = null;

function initFaceMesh() {
    updateStatus('⏳ Loading face detection model...', 60, 'Downloading MediaPipe Face Mesh (~3MB)');
    
    faceMesh = new FaceMesh({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
    });

    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    // Set up face mesh results handler
    faceMesh.onResults((results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            storedFaceLandmarks = results.multiFaceLandmarks[0];
            
            if (faceDetectedElement) {
                faceDetectedElement.textContent = "Yes";
            }
        } else {
            storedFaceLandmarks = null;
            if (faceDetectedElement) {
                faceDetectedElement.textContent = "No";
            }
        }
    });
    
    // Simulate progress
    setTimeout(() => {
        updateStatus('✅ Face detection loaded!', 80, 'Initializing camera...');
    }, 500);
}

/**
 * Check if a finger is extended
 */
function isFingerExtended(landmarks, tipIdx, pipIdx, mcpIdx) {
    // In normalized coordinates, y increases downward
    // Finger is extended if tip.y < pip.y < mcp.y
    return landmarks[tipIdx].y < landmarks[pipIdx].y && 
           landmarks[pipIdx].y < landmarks[mcpIdx].y;
}

/**
 * Detect gesture from hand landmarks
 */
function detectGesture(handLandmarks, allHands, faceLandmarks) {
    try {
        if (!handLandmarks) {
            // Check for face-only gestures (JIJIJA)
            if (faceLandmarks && Array.isArray(faceLandmarks)) {
                return detectFaceGesture(faceLandmarks);
            }
            return "none";
        }

        const landmarks = handLandmarks;

        // Count extended fingers
        const extendedFingers = [];

        // Index finger (8: tip, 6: PIP, 5: MCP)
        if (isFingerExtended(landmarks, 8, 6, 5)) {
            extendedFingers.push("index");
        }

        // Middle finger (12: tip, 10: PIP, 9: MCP)
        if (isFingerExtended(landmarks, 12, 10, 9)) {
            extendedFingers.push("middle");
        }

        // Ring finger (16: tip, 14: PIP, 13: MCP)
        if (isFingerExtended(landmarks, 16, 14, 13)) {
            extendedFingers.push("ring");
        }

        // Pinky finger (20: tip, 18: PIP, 17: MCP)
        if (isFingerExtended(landmarks, 20, 18, 17)) {
            extendedFingers.push("pinky");
        }

        const numExtended = extendedFingers.length;
        
        // Debug: log finger detection
        if (numExtended > 0) {
            console.log('Extended fingers:', extendedFingers, 'Count:', numExtended);
        }

        // JIJIJA - Laughing (mouth open detection)
        if (faceLandmarks && Array.isArray(faceLandmarks)) {
            const jijijaResult = detectFaceGesture(faceLandmarks);
            if (jijijaResult === "jijija") {
                return "jijija";
            }
        }

    // MIMIMI - Both hands closed (fists)
    if (allHands && allHands.length === 2) {
        let hand1Extended = 0;
        let hand2Extended = 0;

        // Count extended fingers for hand 1
        const fingerChecks = [[8, 6, 5], [12, 10, 9], [16, 14, 13], [20, 18, 17]];
        for (const [tip, pip, mcp] of fingerChecks) {
            if (allHands[0][tip].y < allHands[0][pip].y) {
                hand1Extended++;
            }
        }

        // Count extended fingers for hand 2
        for (const [tip, pip, mcp] of fingerChecks) {
            if (allHands[1][tip].y < allHands[1][pip].y) {
                hand2Extended++;
            }
        }

        // Both hands closed (fists)
        if (hand1Extended === 0 && hand2Extended === 0) {
            return "mimimi";
        }
    }

    // THINKING - Index finger touching chin/lip area (thinking pose)
    // Check this BEFORE CERRAO since it's more specific (requires face)
    if (numExtended === 1 && extendedFingers.includes("index") && faceLandmarks) {
        const indexTip = landmarks[8];
        
        // Face mesh landmarks: 18: chin, 175: chin bottom, 13: upper lip, 14: lower lip
        const chin = faceLandmarks[18];
        const chinBottom = faceLandmarks[175];
        const lowerLip = faceLandmarks[14];
        const upperLip = faceLandmarks[13];
        
        if (chin && lowerLip && upperLip) {
            const distToChin = Math.sqrt((indexTip.x - chin.x) ** 2 + (indexTip.y - chin.y) ** 2);
            const distToChinBottom = Math.sqrt((indexTip.x - chinBottom.x) ** 2 + (indexTip.y - chinBottom.y) ** 2);
            const distToLowerLip = Math.sqrt((indexTip.x - lowerLip.x) ** 2 + (indexTip.y - lowerLip.y) ** 2);
            const distToUpperLip = Math.sqrt((indexTip.x - upperLip.x) ** 2 + (indexTip.y - upperLip.y) ** 2);
            
            // Check if finger is below the nose and close to chin/lip
            const fingerBelowNose = indexTip.y > upperLip.y - 0.05;
            
            if (fingerBelowNose && (distToChin < 0.18 || distToChinBottom < 0.18 || 
                                   distToLowerLip < 0.16 || distToUpperLip < 0.16)) {
                return "thinking";
            }
        }
    }

    // CERRAO - One hand with only index finger extended
    if (numExtended === 1 && extendedFingers.includes("index")) {
        return "cerrao";
    }

    // PEACE - Peace sign (V-sign): index and middle fingers extended, ring and pinky closed
    if (numExtended === 2 && extendedFingers.includes("index") && extendedFingers.includes("middle")) {
        const ringExtended = isFingerExtended(landmarks, 16, 14, 13);
        const pinkyExtended = isFingerExtended(landmarks, 20, 18, 17);
        
        if (!ringExtended && !pinkyExtended) {
            return "peace";
        }
    }

    // TIMEOUT - T-shape gesture (one hand horizontal, other vertical)
    // Check this BEFORE SIXSEVEN since both require two hands with extended fingers
    if (allHands && allHands.length === 2) {
        const hand1 = allHands[0];
        const hand2 = allHands[1];
        
        // Check if both hands have fingers extended (at least 1 finger)
        let hand1ExtendedCount = 0;
        let hand2ExtendedCount = 0;
        
        const fingerChecks = [[8, 6, 5], [12, 10, 9], [16, 14, 13], [20, 18, 17]];
        for (const [tip, pip, mcp] of fingerChecks) {
            if (hand1[tip].y < hand1[pip].y) hand1ExtendedCount++;
            if (hand2[tip].y < hand2[pip].y) hand2ExtendedCount++;
        }
        
        if (hand1ExtendedCount >= 1 && hand2ExtendedCount >= 1) {
            // Calculate hand orientations
            const hand1FingersY = [hand1[8].y, hand1[12].y, hand1[16].y, hand1[20].y];
            const hand1FingersX = [hand1[8].x, hand1[12].x, hand1[16].x, hand1[20].x];
            const hand1YVar = Math.max(...hand1FingersY) - Math.min(...hand1FingersY);
            const hand1XVar = Math.max(...hand1FingersX) - Math.min(...hand1FingersX);
            const hand1AvgY = hand1FingersY.reduce((a, b) => a + b, 0) / 4;
            const hand1WristDist = Math.abs(hand1[0].y - hand1AvgY);
            
            const hand2FingersY = [hand2[8].y, hand2[12].y, hand2[16].y, hand2[20].y];
            const hand2FingersX = [hand2[8].x, hand2[12].x, hand2[16].x, hand2[20].x];
            const hand2YVar = Math.max(...hand2FingersY) - Math.min(...hand2FingersY);
            const hand2XVar = Math.max(...hand2FingersX) - Math.min(...hand2FingersX);
            const hand2AvgY = hand2FingersY.reduce((a, b) => a + b, 0) / 4;
            const hand2WristDist = Math.abs(hand2[0].y - hand2AvgY);
            
            // Very lenient orientation detection
            const hand1IsHorizontal = hand1YVar < 0.15 || hand1XVar > 0.03;
            const hand2IsHorizontal = hand2YVar < 0.15 || hand2XVar > 0.03;
            const hand1IsVertical = hand1WristDist > 0.08 || hand1YVar > 0.12;
            const hand2IsVertical = hand2WristDist > 0.08 || hand2YVar > 0.12;
            
            if ((hand1IsHorizontal && hand2IsVertical) || (hand1IsVertical && hand2IsHorizontal)) {
                // Calculate distance between hand centers
                const hand1CenterX = (hand1[0].x + hand1FingersX.reduce((a, b) => a + b, 0) / 4) / 2;
                const hand1CenterY = (hand1[0].y + hand1AvgY) / 2;
                const hand2CenterX = (hand2[0].x + hand2FingersX.reduce((a, b) => a + b, 0) / 4) / 2;
                const hand2CenterY = (hand2[0].y + hand2AvgY) / 2;
                
                const centerDistX = Math.abs(hand1CenterX - hand2CenterX);
                const centerDistY = Math.abs(hand1CenterY - hand2CenterY);
                
                if (centerDistX < 0.3 && centerDistY < 0.3) {
                    // Check if one hand's key points are near the other hand's palm
                    const hHand = hand1IsHorizontal ? hand1 : hand2;
                    const vHand = hand1IsHorizontal ? hand2 : hand1;
                    
                    const hWrist = hHand[0];
                    const hMcp = hHand[9];
                    const hPalmX = (hWrist.x + hMcp.x) / 2;
                    const hPalmY = (hWrist.y + hMcp.y) / 2;
                    
                    const vPinky = vHand[20];
                    const vWrist = vHand[0];
                    
                    const distPinky = Math.sqrt((vPinky.x - hPalmX) ** 2 + (vPinky.y - hPalmY) ** 2);
                    const distWrist = Math.sqrt((vWrist.x - hPalmX) ** 2 + (vWrist.y - hPalmY) ** 2);
                    
                    const minDist = Math.min(distPinky, distWrist);
                    
                    if (minDist < 0.3 && ((hand1IsHorizontal && hand2IsVertical) || (hand1IsVertical && hand2IsHorizontal))) {
                        const hFingersX = [hHand[8].x, hHand[12].x, hHand[16].x, hHand[20].x];
                        const hXSpan = Math.max(...hFingersX) - Math.min(...hFingersX);
                        if (hXSpan > 0.06) {
                            return "timeout";
                        }
                    }
                    
                    if (minDist < 0.2) {
                        return "timeout";
                    }
                }
            }
        }
    }

    // SIXSEVEN - Both hands with open palms, spread apart (balance pose)
    if (allHands && allHands.length === 2) {
        let hand1Extended = 0;
        let hand2Extended = 0;

        // Check if hands have extended fingers
        if (allHands[0][8].y < allHands[0][6].y) hand1Extended++;
        if (allHands[0][12].y < allHands[0][10].y) hand1Extended++;
        if (allHands[0][16].y < allHands[0][14].y) hand1Extended++;

        if (allHands[1][8].y < allHands[1][6].y) hand2Extended++;
        if (allHands[1][12].y < allHands[1][10].y) hand2Extended++;
        if (allHands[1][16].y < allHands[1][14].y) hand2Extended++;

        if (hand1Extended >= 2 && hand2Extended >= 2) {
            // Check if hands are spread apart
            const hand1Wrist = allHands[0][0];
            const hand2Wrist = allHands[1][0];
            const xDistance = Math.abs(hand1Wrist.x - hand2Wrist.x);

            if (xDistance > 0.3) {
                return "sixseven";
            }
        }
    }

    return "none";
    } catch (error) {
        console.error('Error in detectGesture:', error);
        return "none";
    }
}

/**
 * Detect face-only gestures (JIJIJA - laughing)
 */
function detectFaceGesture(faceLandmarks) {
    if (!faceLandmarks || !faceLandmarks.length) {
        return "none";
    }

    // Key face landmarks for mouth detection (matching Python version)
    // 13: upper lip, 14: lower lip, 61: left mouth corner, 84: right mouth corner
    const upperLip = faceLandmarks[13];
    const lowerLip = faceLandmarks[14];
    const leftCorner = faceLandmarks[61];
    const rightCorner = faceLandmarks[84];

    if (!upperLip || !lowerLip || !leftCorner || !rightCorner) {
        return "none";
    }

    // Calculate mouth opening
    const mouthHeight = Math.abs(upperLip.y - lowerLip.y);
    const mouthWidth = Math.abs(rightCorner.x - leftCorner.x);

    // Update debug info
    if (mouthHeightElement) {
        mouthHeightElement.textContent = mouthHeight.toFixed(3);
        mouthWidthElement.textContent = mouthWidth.toFixed(3);
    }

    // Check if mouth is open (laughing) - same thresholds as Python version
    if (mouthHeight > 0.01 && mouthWidth > 0.005) {
        return "jijija";
    }

    return "none";
}

/**
 * Handle results from MediaPipe
 */
async function onResults(results) {
    // Update FPS
    fpsCounter++;
    
    // Clear canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    let detectedGesture = "none";

    // Process with face mesh to detect mouth (do this first so landmarks are ready)
    if (results.image && faceMesh) {
        try {
            await faceMesh.send({ image: results.image });
        } catch (e) {
            console.error('Face mesh error:', e);
        }
    }

    // Use the stored face landmarks from the faceMesh callback
    const currentFaceLandmarks = storedFaceLandmarks || null;

    // Draw hand landmarks
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: '#00FF00',
                lineWidth: 2
            });
            drawLandmarks(canvasCtx, landmarks, {
                color: '#FF0000',
                lineWidth: 1,
                radius: 3
            });
        }

        // Update debug info
        if (handsCountElement) {
            handsCountElement.textContent = results.multiHandLandmarks.length;
        }

        // Detect gesture
        try {
            detectedGesture = detectGesture(
                results.multiHandLandmarks[0],
                results.multiHandLandmarks,
                currentFaceLandmarks
            );
        } catch (e) {
            console.error('Gesture detection error:', e);
            detectedGesture = "none";
        }
    } else {
        // No hands detected
        if (handsCountElement) {
            handsCountElement.textContent = "0";
        }
        
        // Check for face-only gestures
        try {
            detectedGesture = detectGesture(null, null, currentFaceLandmarks);
        } catch (e) {
            console.error('Face-only gesture detection error:', e);
            detectedGesture = "none";
        }
    }

    canvasCtx.restore();

    // Update gesture if changed
    if (detectedGesture !== currentGesture) {
        currentGesture = detectedGesture;
        console.log('Gesture detected:', detectedGesture);
        updateGestureDisplay(currentGesture);
    }
}

// Make face landmarks available to gesture detection (legacy support)
Object.defineProperty(window, 'faceLandmarks', {
    get: function() {
        return storedFaceLandmarks;
    }
});

// Also update storedFaceLandmarks directly from callback

/**
 * Update gesture display and meme
 */
function updateGestureDisplay(gesture) {
    try {
        // Update label
        const gestureText = gesture.charAt(0).toUpperCase() + gesture.slice(1);
        gestureLabelElement.textContent = `Gesture: ${gestureText}`;

        // Update meme
        const memeFile = GESTURE_MEMES[gesture];
        
        if (!memeFile) {
            console.error('No meme file found for gesture:', gesture);
            return;
        }
        
        if (memeFile.endsWith('.mp4') || memeFile.endsWith('.webm')) {
            // Video meme
            memeImageElement.style.display = 'none';
            memeVideoElement.style.display = 'block';
            
            // Get full URL to avoid path issues
            const fullPath = memeFile.startsWith('http') ? memeFile : 
                           (memeFile.startsWith('/') ? memeFile : '/' + memeFile);
            
            if (memeVideoElement.src && !memeVideoElement.src.includes(memeFile)) {
                memeVideoElement.src = fullPath;
                memeVideoElement.load();
                memeVideoElement.play().catch(e => console.log('Video play failed:', e));
            } else if (!memeVideoElement.src) {
                memeVideoElement.src = fullPath;
                memeVideoElement.load();
                memeVideoElement.play().catch(e => console.log('Video play failed:', e));
            }
        } else {
            // Image meme
            memeVideoElement.style.display = 'none';
            memeImageElement.style.display = 'block';
            
            // Get full URL to avoid path issues
            const fullPath = memeFile.startsWith('http') ? memeFile : 
                           (memeFile.startsWith('/') ? memeFile : '/' + memeFile);
            memeImageElement.src = fullPath;
        }
    } catch (error) {
        console.error('Error updating gesture display:', error);
    }
}

/**
 * Initialize camera
 */
async function initCamera() {
    try {
        updateStatus('📸 Starting camera...', 90, 'Requesting camera permissions...');
        
        camera = new Camera(webcamElement, {
            onFrame: async () => {
                await hands.send({ image: webcamElement });
            },
            width: 640,
            height: 480
        });

        await camera.start();
        
        // Wait a bit for video to start
        await new Promise(resolve => setTimeout(resolve, 300));
        
        updateStatus('✅ Ready!', 100, 'Gestures are now being detected...');
        
        // Hide loading after a moment
        setTimeout(() => {
            loadingElement.style.display = 'none';
        }, 1000);
        
        // Set canvas size to match video
        canvasElement.width = webcamElement.videoWidth || 640;
        canvasElement.height = webcamElement.videoHeight || 480;

        // Start FPS counter
        startFPSCounter();

        console.log('Camera started successfully!');
    } catch (error) {
        console.error('Error starting camera:', error);
        updateStatus('❌ Camera Error', 100, 'Please allow camera access and refresh the page.');
        loadingElement.innerHTML = `
            <div id="statusIndicator">
                <p>❌ Camera Error</p>
                <p class="status-subtext">Please allow camera access and refresh the page.</p>
                <button id="retryButton" onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #171717; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: 'Geist Sans', sans-serif;">Retry</button>
            </div>
        `;
    }
}

/**
 * FPS Counter
 */
function startFPSCounter() {
    setInterval(() => {
        if (fpsElement) {
            fpsElement.textContent = fpsCounter;
        }
        fpsCounter = 0;
    }, 1000);
}

/**
 * Initialize everything
 */
async function init() {
    console.log('Initializing Gesture Meme Tracker...');
    
    // Initial status
    updateStatus('⏳ Initializing...', 10, 'Setting up MediaPipe...');
    
    // Initialize MediaPipe
    initHands();
    initFaceMesh();
    
    // Wait a bit for models to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user needs to click to start (some browsers require user interaction)
    try {
        await initCamera();
    } catch (error) {
        updateStatus('📸 Camera Ready', 90, 'Click below to start the camera');
        // Show start button if autoplay is blocked
        startButton.style.display = 'block';
        startButton.onclick = async () => {
            try {
                await initCamera();
                startButton.style.display = 'none';
            } catch (e) {
                console.error('Failed to start camera:', e);
                updateStatus('❌ Failed to start camera', 100, 'Please check permissions');
            }
        };
    }
}

// Modify detectGesture to use stored face landmarks
function detectGestureWithFace(handLandmarks, allHands) {
    return detectGesture(handLandmarks, allHands, window.faceLandmarks);
}

// Start when page loads
window.addEventListener('load', init);

