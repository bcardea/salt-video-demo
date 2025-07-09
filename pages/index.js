import Head from 'next/head'
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Head>
        <title>SaaS Demo Animation Studio</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
    <div className="container">
        <div className="control-panel">
            <h1>SaaS Demo Animation Studio</h1>
            
            <div className="section">
                <h3>Input & Response</h3>
                <div className="input-group">
                    <label htmlFor="inputText">User Input Text</label>
                    <textarea id="inputText" placeholder="What the user types...">Create a landing page for my AI startup</textarea>
                </div>
                <div className="input-group">
                    <label htmlFor="responseText">App Response</label>
                    <textarea id="responseText" placeholder="What the app responds with...">I'll help you create a modern, conversion-focused landing page for your AI startup. Let me design a clean, professional layout that highlights your unique value proposition and drives user engagement.</textarea>
                </div>
            </div>

            <div className="section">
                <h3>Layout & Style</h3>
                <div className="input-group">
                    <label htmlFor="inputPosition">Input Position</label>
                    <select id="inputPosition" className="input-group select">
                        <option value="center">Center</option>
                        <option value="flex-start">Top</option>
                        <option value="flex-end">Bottom</option>
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="responsePosition">Response Position</label>
                    <select id="responsePosition" className="input-group select">
                        <option value="center">Center</option>
                        <option value="flex-start">Top</option>
                        <option value="flex-end">Bottom</option>
                    </select>
                </div>
                <div className="input-group" style="display: flex; align-items: center; gap: 15px;">
                    <div style="flex: 1;">
                        <label htmlFor="gradientStartColor">Pill Gradient Start</label>
                        <input type="color" id="gradientStartColor" value="#667eea" className="color-input" />
                    </div>
                    <div style="flex: 1;">
                        <label htmlFor="gradientEndColor">Pill Gradient End</label>
                        <input type="color" id="gradientEndColor" value="#764ba2" className="color-input" />
                    </div>
                </div>
            </div>

            <div className="section">
                <h3>Animation</h3>
                <div style="display: flex; margin-bottom: 20px;">
                    <div style="flex: 1;">
                        <div className="slider-group">
                            <label>
                                Input Rotate X
                                <span className="slider-value" id="inputRotateXValue">-15°</span>
                            </label>
                            <input type="range" id="inputRotateX" className="slider" min="-45" max="45" value="-15" />
                        </div>
                        <div className="slider-group">
                            <label>
                                Input Rotate Y
                                <span className="slider-value" id="inputRotateYValue">0°</span>
                            </label>
                            <input type="range" id="inputRotateY" className="slider" min="-45" max="45" value="0" />
                        </div>
                    </div>
                    <div style="width: 120px; height: 120px; margin-left: 15px;">
                        <div id="inputPreviewBox" style="width: 100%; height: 100%; background: rgba(255, 255, 255, 0.05); border-radius: 8px; position: relative; transform-style: preserve-3d; transform: rotateX(-15deg) rotateY(0deg); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
                            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;"></div>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: rgba(255, 255, 255, 0.5);">Input</div>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; margin-bottom: 20px;">
                    <div style="flex: 1;">
                        <div className="slider-group">
                            <label>
                                Response Rotate X
                                <span className="slider-value" id="responseRotateXValue">-15°</span>
                            </label>
                            <input type="range" id="responseRotateX" className="slider" min="-45" max="45" value="-15" />
                        </div>
                        <div className="slider-group">
                            <label>
                                Response Rotate Y
                                <span className="slider-value" id="responseRotateYValue">0°</span>
                            </label>
                            <input type="range" id="responseRotateY" className="slider" min="-45" max="45" value="0" />
                        </div>
                    </div>
                    <div style="width: 120px; height: 120px; margin-left: 15px;">
                        <div id="responsePreviewBox" style="width: 100%; height: 100%; background: rgba(255, 255, 255, 0.03); border-radius: 8px; position: relative; transform-style: preserve-3d; transform: rotateX(-15deg) rotateY(0deg); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
                            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;"></div>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: rgba(255, 255, 255, 0.5);">Response</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section">
                <h3>Background</h3>
                <div className="file-upload">
                    <input type="file" id="backgroundUpload" accept="image/*,video/*" onChange="handleBackgroundUpload(event)" />
                    <label htmlFor="backgroundUpload" className="file-upload-label">
                        Upload Background Image/Video
                    </label>
                </div>
                <div id="backgroundPreview" className="media-preview"></div>
            </div>

            <div className="section">
                <h3>Timing</h3>
                <div className="slider-group">
                    <label htmlFor="inputDelay">
                        Input Appear Delay
                        <span className="slider-value" id="inputDelayValue">0s</span>
                    </label>
                    <input type="range" id="inputDelay" className="slider" min="0" max="2" step="0.1" value="0" />
                </div>
                <div className="slider-group">
                    <label htmlFor="responseDelay">
                        Response Appear Delay
                        <span className="slider-value" id="responseDelayValue">1.5s</span>
                    </label>
                    <input type="range" id="responseDelay" className="slider" min="0" max="5" step="0.1" value="1.5" />
                </div>
                <div className="slider-group">
                    <label htmlFor="animationDuration">
                        Animation Duration
                        <span className="slider-value" id="animationDurationValue">0.8s</span>
                    </label>
                    <input type="range" id="animationDuration" className="slider" min="0.3" max="2" step="0.1" value="0.8" />
                </div>
            </div>

            <div className="section">
                <button className="btn" onClick="previewAnimation()">Preview Animation</button>
                <button className="btn btn-secondary" onClick="resetAnimation()">Reset</button>
                <button className="btn" onClick="showExportModal()">Export Video</button>
            </div>
        </div>

        <div className="preview-area">
            <div className="aspect-ratio-controls">
                <button className="aspect-ratio-btn" id="ratio-16-9">16:9</button>
                <button className="aspect-ratio-btn active" id="ratio-9-16">9:16</button>
                <button className="aspect-ratio-btn" id="ratio-3-4">3:4</button>
                <button className="aspect-ratio-btn" id="ratio-full">Full</button>
            </div>
            <div className="preview-container" id="previewContainer">
                <div id="video-container">
                    <div id="backgroundContainer"></div>
                    <div className="background-overlay" id="backgroundOverlay" style="display: none;"></div>
                    <div className="animation-stage" id="animationStage">
                        <!-- Animation elements will be inserted here -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="export-modal" id="exportModal">
        <div className="export-modal-content">
            <h2>Export Your Animation</h2>
            <div id="export-options-container">
                <div className="export-options">
                    <div className="export-option" onClick="selectExportOption('mp4')">
                        <h3>MP4</h3>
                        <p>1920x1080</p>
                    </div>
                    <div className="export-option" onClick="selectExportOption('webm')">
                        <h3>WebM</h3>
                        <p>With Alpha</p>
                    </div>
                    <div className="export-option" onClick="selectExportOption('gif')">
                        <h3>GIF</h3>
                        <p>Animated</p>
                    </div>
                </div>
                <button className="btn" id="start-export-btn" onClick="startExport()">Start Export</button>
                <button className="btn btn-secondary" onClick="closeExportModal()">Cancel</button>
            </div>
            
            <div id="export-progress" style="display: none;">
                <div id="recording-indicator" style="display: none; margin-bottom: 15px;">
                    <div className="recording-dot" style="display: inline-block; width: 12px; height: 12px; background-color: red; border-radius: 50%; margin-right: 8px; animation: pulse 1s infinite;"></div>
                    <span style="color: red; font-weight: bold;">RECORDING</span>
                </div>
                <p id="export-status">Preparing to export...</p>
                <div className="progress-bar" id="progressBar">
                    <div className="progress-fill" id="progressFill"></div>
                </div>
                <p><small>Please keep this tab open. Video export may take a few minutes.</small></p>
                <div id="download-container" style="display: none; margin-top: 20px;">
                    <a id="download-link" className="btn" download>Download Video</a>
                    <button className="btn btn-secondary" onClick="closeExportModal()">Close</button>
                </div>
            </div>
            
        </div>
    </div>

      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" strategy="afterInteractive" />
      <Script src="/script.js" strategy="afterInteractive" />
    </>
  )
}
