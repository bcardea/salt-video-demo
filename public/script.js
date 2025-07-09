        let backgroundMedia = null;
        let selectedExportFormat = 'mp4';
        let animationTimeouts = [];
        let currentAspectRatio = '9:16'; // Default aspect ratio

        // Initialize all sliders
        const sliders = [
            { id: 'inputRotateX', suffix: '°' },
            { id: 'inputRotateY', suffix: '°' },
            { id: 'responseRotateX', suffix: '°' },
            { id: 'responseRotateY', suffix: '°' },
            { id: 'inputDelay', suffix: 's' },
            { id: 'responseDelay', suffix: 's' },
            { id: 'animationDuration', suffix: 's' }
        ];

        // Function to update 3D preview boxes
        function update3DPreview() {
            const inputRotateX = document.getElementById('inputRotateX').value;
            const inputRotateY = document.getElementById('inputRotateY').value;
            const responseRotateX = document.getElementById('responseRotateX').value;
            const responseRotateY = document.getElementById('responseRotateY').value;
            
            document.getElementById('inputPreviewBox').style.transform = 
                `rotateX(${inputRotateX}deg) rotateY(${inputRotateY}deg)`;
            
            document.getElementById('responsePreviewBox').style.transform = 
                `rotateX(${responseRotateX}deg) rotateY(${responseRotateY}deg)`;
        }

        sliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            const valueElement = document.getElementById(slider.id + 'Value');
            element.addEventListener('input', function(e) {
                valueElement.textContent = e.target.value + slider.suffix;
                
                // Update 3D preview boxes when rotation sliders change
                if (slider.id.includes('Rotate')) {
                    update3DPreview();
                }
            });
        });
        
        // Initialize 3D preview
        update3DPreview();
        
        // Initialize aspect ratio
        window.addEventListener('load', function() {
            setAspectRatio('9:16');
            
            // Add event listeners to aspect ratio buttons
            document.getElementById('ratio-16-9').addEventListener('click', function() {
                setAspectRatio('16:9');
            });
            
            document.getElementById('ratio-9-16').addEventListener('click', function() {
                setAspectRatio('9:16');
            });
            
            document.getElementById('ratio-3-4').addEventListener('click', function() {
                setAspectRatio('3:4');
            });
            
            document.getElementById('ratio-full').addEventListener('click', function() {
                setAspectRatio('full');
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            setAspectRatio(currentAspectRatio);
        });

        // Background upload handler
        function handleBackgroundUpload(event) {
            const file = event.target.files[0];
            if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    backgroundMedia = {
                        type: file.type.startsWith('image/') ? 'image' : 'video',
                        url: e.target.result,
                        name: file.name
                    };
                    updateBackgroundPreview();
                };
                reader.readAsDataURL(file);
            }
        }

        function updateBackgroundPreview() {
            const preview = document.getElementById('backgroundPreview');
            if (backgroundMedia) {
                preview.innerHTML = `
                    <div class="media-item">
                        ${backgroundMedia.type === 'image' 
                            ? `<img src="${backgroundMedia.url}" alt="${backgroundMedia.name}">` 
                            : `<video src="${backgroundMedia.url}" muted loop></video>`
                        }
                        <button onclick="removeBackground()" class="remove-btn">×</button>
                    </div>
                `;
            } else {
                preview.innerHTML = '';
            }
        }

        function removeBackground() {
            backgroundMedia = null;
            updateBackgroundPreview();
            document.getElementById('backgroundUpload').value = '';
            document.getElementById('backgroundContainer').innerHTML = '';
            document.getElementById('backgroundOverlay').style.display = 'none';
        }

        function previewAnimation() {
            resetAnimation();
            const animationStage = document.getElementById('animationStage');

            // Set background
            const backgroundContainer = document.getElementById('backgroundContainer');
            const backgroundOverlay = document.getElementById('backgroundOverlay');
            backgroundContainer.innerHTML = ''; // Clear previous background
            if (backgroundMedia) {
                if (backgroundMedia.type === 'image') {
                    backgroundContainer.innerHTML = `<img src="${backgroundMedia.url}" class="background-media" alt="Background">`;
                } else {
                    backgroundContainer.innerHTML = `<video src="${backgroundMedia.url}" class="background-media" autoplay muted loop></video>`;
                }
                backgroundOverlay.style.display = 'block';
            } else {
                backgroundOverlay.style.display = 'none';
            }

            // Get values from all controls
            const inputText = document.getElementById('inputText').value;
            const responseText = document.getElementById('responseText').value;
            const animationDuration = parseFloat(document.getElementById('animationDuration').value);
            const inputDelayEnabled = document.getElementById('inputDelay').checked;
            const inputInitialDelay = inputDelayEnabled ? 1.5 * 1000 : 0; // ms
            const responseStartDelay = parseFloat(document.getElementById('responseDelay').value) * 1000;

            // New layout and style controls
            const inputPosition = document.getElementById('inputPosition').value;
            const responsePosition = document.getElementById('responsePosition').value;
            const gradientStartColor = document.getElementById('gradientStartColor').value;
            const gradientEndColor = document.getElementById('gradientEndColor').value;

            // --- INPUT ANIMATION ---
            const inputPill = document.createElement('div');
            inputPill.className = 'input-pill';
            inputPill.style.setProperty('--gradient-start', gradientStartColor);
            inputPill.style.setProperty('--gradient-end', gradientEndColor);
            
            // Create a container for the typing text to ensure proper width control
            const typingContainer = document.createElement('div');
            typingContainer.style.display = 'inline-block';
            
            // Create typing text element
            const typingTextElement = document.createElement('span');
            typingTextElement.className = 'typing-text';
            typingTextElement.textContent = inputText;
            
            // Add the typing text to the container, then to the pill
            typingContainer.appendChild(typingTextElement);
            inputPill.appendChild(typingContainer);
            
            const inputRotateX = document.getElementById('inputRotateX').value;
            const inputRotateY = document.getElementById('inputRotateY').value;
            inputPill.style.transform = `rotateX(${inputRotateX}deg) rotateY(${inputRotateY}deg)`;

            // Use the actual input delay value from the slider
            const inputDelayValue = parseFloat(document.getElementById('inputDelay').value) * 1000; // Convert to ms
            
            const inputRevealTimeout = setTimeout(() => {
                animationStage.style.justifyContent = inputPosition;
                animationStage.appendChild(inputPill);
                inputPill.style.animation = `reveal ${animationDuration}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;
                
                // Start typing animation after the pill appears
                setTimeout(() => {
                    // Calculate typing speed based on text length
                    const typingDuration = Math.min(inputText.length * 50, animationDuration * 500); // 50ms per character, capped
                    
                    // Animate typing with CSS transition
                    typingTextElement.style.transition = `width ${typingDuration}ms steps(${inputText.length}, end), opacity 0.2s ease`;
                    
                    // Force reflow
                    void typingTextElement.offsetWidth;
                    
                    // Start typing animation
                    typingTextElement.style.width = '100%';
                    typingTextElement.style.opacity = '1';
                }, 200); // Small delay after pill appears
            }, inputDelayValue); // Use the actual input delay value
            animationTimeouts.push(inputRevealTimeout);

            // Calculate typing duration for fade-out timing
            const typingDuration = Math.min(inputText.length * 50, animationDuration * 500); // Same calculation as above
            
            const inputFadeOutTimeout = setTimeout(() => {
                inputPill.style.animation = `inputFadeOut ${animationDuration * 0.8}s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
            }, inputDelayValue + (animationDuration * 1000) + typingDuration + 500);
            animationTimeouts.push(inputFadeOutTimeout);
            
            // --- RESPONSE ANIMATION ---
            const totalInputAnimationTime = inputDelayValue + (animationDuration * 1000) + typingDuration + 500 + (animationDuration * 0.8 * 1000);

            const responseRevealTimeout = setTimeout(() => {
                const responseDocument = document.createElement('div');
                responseDocument.className = 'response-document';

                const responseTextElement = document.createElement('p');
                responseTextElement.textContent = responseText;
                responseDocument.appendChild(responseTextElement);
                


                animationStage.style.justifyContent = responsePosition;
                animationStage.appendChild(responseDocument);
                responseDocument.style.animation = `documentReveal ${animationDuration * 1.2}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;

                // --- SCROLL & FADE-OUT LOGIC ---
                const containerHeight = responseDocument.clientHeight;
                const textHeight = responseTextElement.scrollHeight;
                let scrollDuration = 0;

                if (textHeight > containerHeight) {
                    const scrollSpeed = 70; // pixels per second
                    scrollDuration = textHeight / scrollSpeed;
                    
                    const animationName = `scroll-anim-${Date.now()}`;
                    const keyframes = `
                        @keyframes ${animationName} {
                            from { transform: translateY(${containerHeight * 0.8}px); }
                            to { transform: translateY(-${textHeight}px); }
                        }
                    `;
                    const styleSheet = document.createElement('style');
                    styleSheet.id = animationName;
                    styleSheet.innerText = keyframes;
                    document.head.appendChild(styleSheet);

                    responseTextElement.style.animation = `${animationName} ${scrollDuration}s linear forwards`;
                }

                // Fade out the response document after it's done
                const responseFadeOutDelay = (scrollDuration * 1000) + 1000; // 1s after scroll finishes
                const responseFadeOutTimeout = setTimeout(() => {
                    responseDocument.style.animation = `responseFadeOut ${animationDuration}s forwards`;
                }, responseFadeOutDelay);
                animationTimeouts.push(responseFadeOutTimeout);

            }, Math.max(totalInputAnimationTime, responseStartDelay));
            animationTimeouts.push(responseRevealTimeout);
        }

        function resetAnimation() {
            animationTimeouts.forEach(item => {
                if (typeof item === 'number') clearTimeout(item);
            });
            animationTimeouts = [];
            
            // Remove old keyframe stylesheets
            const oldStyles = document.querySelectorAll('style[id^="scroll-anim-"]');
            oldStyles.forEach(s => document.head.removeChild(s));

            document.getElementById('animationStage').innerHTML = '';
        }
        
        function setAspectRatio(ratio) {
            currentAspectRatio = ratio;
            const videoContainer = document.getElementById('video-container');
            const previewContainer = document.getElementById('previewContainer');
            
            // Reset any previous styles
            videoContainer.style.width = '';
            videoContainer.style.height = '';
            videoContainer.style.border = '';
            
            // Update active button state
            document.querySelectorAll('.aspect-ratio-btn').forEach(btn => {
                btn.classList.remove('active');
                if(btn.textContent.toLowerCase() === ratio.toLowerCase()) {
                    btn.classList.add('active');
                }
            });

            const containerWidth = previewContainer.clientWidth;
            const containerHeight = previewContainer.clientHeight;
            
            if (ratio === 'full') {
                videoContainer.style.width = '100%';
                videoContainer.style.height = '100%';
                return;
            }
            
            const [width, height] = ratio.split(':').map(Number);
            const aspectRatio = width / height;
            
            let stageWidth, stageHeight;
            
            if (containerWidth / containerHeight > aspectRatio) {
                stageHeight = containerHeight * 0.95; // Use 95% of height for some padding
                stageWidth = stageHeight * aspectRatio;
            } else {
                stageWidth = containerWidth * 0.95; // Use 95% of width for some padding
                stageHeight = stageWidth / aspectRatio;
            }
            
            videoContainer.style.width = `${stageWidth}px`;
            videoContainer.style.height = `${stageHeight}px`;
            videoContainer.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        }

        function showExportModal() {
            document.getElementById('exportModal').style.display = 'flex';
        }

        function closeExportModal() {
            document.getElementById('exportModal').style.display = 'none';
            document.getElementById('progressBar').style.display = 'none';
            document.getElementById('progressFill').style.width = '0%';
        }

        function selectExportOption(format) {
            selectedExportFormat = format;
            document.querySelectorAll('.export-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            event.target.closest('.export-option').classList.add('selected');
        }

        // Global variables for video export
        let mediaRecorder;
        let recordedChunks = [];
        let recordingCanvas;
        let recordingStream;
        let recordingStartTime;
        let animationDuration = 0;
        let exportFormat = 'mp4';

        async function startExport() {
            // Hide options and show progress
            document.getElementById('export-options-container').style.display = 'none';
            document.getElementById('export-progress').style.display = 'block';
            
            updateExportStatus('Preparing animation...');
            setProgress(10);
            
            try {
                // Reset animation and prepare for recording
                resetAnimation();
                recordedChunks = [];
                
                // Calculate total animation duration
                const inputText = document.getElementById('inputText').value;
                const responseText = document.getElementById('responseText').value;
                const animDuration = parseFloat(document.getElementById('animationDuration').value);
                const inputDelayValue = parseFloat(document.getElementById('inputDelay').value);
                const responseDelayValue = parseFloat(document.getElementById('responseDelay').value);
                
                // Estimate total animation time (in seconds)
                let totalDuration = inputDelayValue + (animDuration * 2); // Input animation
                totalDuration += Math.max(responseDelayValue, animDuration); // Response delay
                totalDuration += animDuration * 1.2; // Response reveal
                
                // Add time for text scrolling if needed (estimate)
                const avgReadingSpeed = 0.3; // seconds per word
                const wordCount = responseText.split(/\s+/).length;
                const readingTime = wordCount * avgReadingSpeed;
                totalDuration += readingTime;
                
                // Add fade out time
                totalDuration += animDuration;
                
                // Add a buffer
                totalDuration += 1;
                
                animationDuration = totalDuration * 1000; // Convert to milliseconds
                
                // Set up canvas for recording
                const videoContainer = document.getElementById('video-container');
                
                // Create a canvas that matches the size of the video container
                recordingCanvas = document.createElement('canvas');
                recordingCanvas.width = videoContainer.offsetWidth;
                recordingCanvas.height = videoContainer.offsetHeight;
                
                // Get the canvas context for drawing
                const ctx = recordingCanvas.getContext('2d');
                
                // Start the MediaRecorder
                try {
                    // Get the stream from the canvas
                    recordingStream = recordingCanvas.captureStream(30); // 30 FPS
                    
                    // Create MediaRecorder
                    const options = { mimeType: 'video/webm;codecs=vp9' };
                    mediaRecorder = new MediaRecorder(recordingStream, options);
                    
                    // Set up event handlers
                    mediaRecorder.ondataavailable = handleDataAvailable;
                    mediaRecorder.onstop = finalizeRecording;
                    
                    // Start recording
                    mediaRecorder.start(100); // Collect data every 100ms
                    
                    // Show recording indicator
                    document.getElementById('recording-indicator').style.display = 'block';
                    updateExportStatus('Recording animation...');
                    setProgress(20);
                    
                    // Start the animation
                    previewAnimation();
                    recordingStartTime = Date.now();
                    
                    // Set up the frame capture loop
                    requestAnimationFrame(captureFrame);
                    
                    // Update progress regularly during recording
                    const progressInterval = setInterval(() => {
                        if (mediaRecorder && mediaRecorder.state === 'recording') {
                            const elapsed = Date.now() - recordingStartTime;
                            const elapsedSeconds = Math.floor(elapsed / 1000);
                            const estimatedTotalSeconds = Math.floor(animationDuration / 1000);
                            const remainingSeconds = Math.max(0, estimatedTotalSeconds - elapsedSeconds);
                            
                            // Calculate progress percentage (20-80% range during recording)
                            const progressPercent = Math.min(Math.floor((elapsed / animationDuration) * 60) + 20, 80);
                            setProgress(progressPercent);
                            
                            updateExportStatus(`Recording animation: ${elapsedSeconds}s / ~${estimatedTotalSeconds}s (${remainingSeconds}s remaining)`);
                        } else {
                            clearInterval(progressInterval);
                        }
                    }, 500); // Update every half second
                    
                    // Set a timeout to stop recording after the animation completes
                    setTimeout(() => {
                        clearInterval(progressInterval);
                        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                            mediaRecorder.stop();
                            updateExportStatus('Processing video...');
                            setProgress(80);
                        }
                    }, animationDuration);
                    
                } catch (error) {
                    console.error('MediaRecorder error:', error);
                    updateExportStatus(`MediaRecorder failed: ${error.message}. Try a different browser.`);
                }
                
            } catch (error) {
                console.error('Export failed:', error);
                updateExportStatus(`Export failed: ${error.message}`);
            }
        }
        
        function captureFrame() {
            if (!mediaRecorder || mediaRecorder.state === 'inactive') return;
            
            try {
                const videoContainer = document.getElementById('video-container');
                const ctx = recordingCanvas.getContext('2d');
                
                // Clear the canvas
                ctx.clearRect(0, 0, recordingCanvas.width, recordingCanvas.height);
                
                // Draw the current state of the animation to the canvas
                ctx.drawImage(videoContainer, 0, 0, recordingCanvas.width, recordingCanvas.height);
                
                // Add a visual indicator that recording is happening (small red dot in corner)
                const pulseSize = (Date.now() % 1000) < 500 ? 8 : 6; // Pulsing effect
                ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
                ctx.beginPath();
                ctx.arc(recordingCanvas.width - 20, 20, pulseSize, 0, Math.PI * 2);
                ctx.fill();
                
                // Continue capturing frames
                requestAnimationFrame(captureFrame);
                
            } catch (error) {
                console.error('Frame capture error:', error);
            }
        }
        
        function handleDataAvailable(event) {
            if (event.data && event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        }
        
        function finalizeRecording() {
            updateExportStatus('Processing video data...');
            setProgress(85);
            
            try {
                // Show processing steps with timed updates
                setTimeout(() => {
                    updateExportStatus('Combining video frames...');
                    setProgress(90);
                    
                    setTimeout(() => {
                        // Create a blob from the recorded chunks
                        const blob = new Blob(recordedChunks, { type: 'video/webm' });
                        
                        // Create a download link
                        const url = URL.createObjectURL(blob);
                        const downloadLink = document.getElementById('download-link');
                        downloadLink.href = url;
                        downloadLink.download = `animation_${new Date().getTime()}.webm`;
                        
                        // Show file size
                        const fileSizeMB = (blob.size / (1024 * 1024)).toFixed(2);
                        const fileInfoElement = document.createElement('p');
                        fileInfoElement.innerHTML = `<small>File size: ${fileSizeMB} MB</small>`;
                        document.getElementById('download-container').appendChild(fileInfoElement);
                        
                        // Clean up
                        if (recordingStream) {
                            recordingStream.getTracks().forEach(track => track.stop());
                            recordingStream = null;
                        }
                        
                        // Hide recording indicator and show download button
                        document.getElementById('recording-indicator').style.display = 'none';
                        document.getElementById('download-container').style.display = 'block';
                        
                        updateExportStatus('Export complete! Your video is ready to download.');
                        setProgress(100);
                    }, 800);
                }, 800);
                
            } catch (error) {
                console.error('Finalization error:', error);
                updateExportStatus(`Video finalization failed: ${error.message}`);
                setProgress(0); // Reset progress bar to indicate failure
            }
        }
        
        function updateExportStatus(message) {
            document.getElementById('export-status').textContent = message;
        }
        
        function setProgress(percent) {
            document.getElementById('progressFill').style.width = `${percent}%`;
