<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Avatar Customizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, sans-serif;
        }
        select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 0.5rem center;
            background-repeat: no-repeat;
            background-size: 1.5em 1.5em;
            padding-right: 2.5rem;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-size: 8pt; /* Added font size for dropdowns */
            outline: none; /* Removed outline */
            border-radius: 10px; /* Set roundness */
        }
        /* Custom styles for search suggestions */
        #search-suggestions {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            background-color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            position: absolute;
            width: 100%;
            z-index: 10;
            top: 100%; /* Position below the input */
            left: 0;
            right: 0;
            /* Ensure pointer-events are active for clickability */
            pointer-events: auto; 
        }
        .suggestion-item {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            font-size: 0.875rem; /* text-sm */
            color: #4a5568; /* text-gray-700 */
        }
        .suggestion-item:hover {
            background-color: #f7fafc; /* bg-gray-50 */
        }
        .suggestion-item.composition-suggestion {
            font-weight: bold;
            color: #1a202c; /* text-gray-900 */
            background-color: #e2e8f0; /* bg-gray-200 */
        }
        .suggestion-item.composition-suggestion:hover {
            background-color: #cbd5e0; /* bg-gray-300 */
        }
        /* Default styling for all screen sizes */
        #display-box {
            border: none;
            box-shadow: none;
            border-radius: 10px; /* All corners rounded by default */
        }
        #search-input {
            font-size: 8pt;
        }
        #shuffle-button {
            font-size: 8pt;
        }
        #trait-selection-panel {
            border-radius: 10px; /* All corners rounded by default */
        }
        /* Basic modal styles for share options */
        .modal {
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.6);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .modal-content {
            background-color: #fefefe;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            position: relative;
        }
        .close-button {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
        }
        .share-option-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            font-size: 1rem;
            font-weight: bold;
            color: white;
            transition: background-color 0.2s;
        }
        .share-option-button svg {
            margin-right: 8px;
        }
        .share-option-button.download { background-color: #4CAF50; }
        .share-option-button.download:hover { background-color: #45a049; }
        .share-option-button.x { background-color: #000000; }
        .share-option-button.x:hover { background-color: #333333; }
        .share-option-button.linkedin { background-color: #0077B5; }
        .share-option-button.linkedin:hover { background-color: #005582; }
        .share-option-button.copy { background-color: #6c757d; }
        .share-option-button.copy:hover { background-color: #5a6268; }
        #share-button { /* Specific style for the share button */
            font-size: 8pt; /* Set to 8pt */
            background-color: #97b9cc; /* Changed to 97b9cc */
        }
        #share-button:hover { /* Hover state for the share button */
            background-color: #7a9cb2; /* A slightly darker shade for hover */
        }
        #share-button:active { /* Active state for the share button */
            background-color: #61879c; /* An even darker shade for active */
        }

        /* Adjust for large screens (horizontal layout) */
        @media (min-width: 1024px) {
            #display-box {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
            #trait-selection-panel {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
    </style>
</head>
<body class="min-h-screen flex flex-col text-gray-800 bg-gray-200">

    <!-- Main Content Area (Display Box & Trait Selection) -->
    <main class="flex-grow flex flex-col items-center p-4 sm:p-8 w-full mx-auto">
        <!-- Inner container to control overall max-w-width and internal layout for desktop -->
        <div class="w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row lg:items-stretch lg:justify-center lg:gap-0"> 
            <!-- Left Panel: Display Box, and other UI elements -->
            <div id="left-content-panel" class="flex flex-col items-start w-full max-w-[500px] mx-auto flex-shrink-0 mb-0 lg:h-full lg:flex-1 lg:max-w-none">
                <!-- Composition Display Box -->
                <div id="display-box" class="relative w-full aspect-square overflow-hidden bg-gray-200 mb-0">
                    <img id="layer-lowerFace" class="absolute inset-0 w-full h-full object-contain" alt="" crossorigin="anonymous" onload="console.log('Image loaded for layer-lowerFace:', this.src);" onerror="console.error('Failed to load image for layer-lowerFace:', this.src);">
                    <img id="layer-upperFace" class="absolute inset-0 w-full h-full object-contain" alt="" crossorigin="anonymous" onload="console.log('Image loaded for layer-upperFace:', this.src);" onerror="console.error('Failed to load image for layer-upperFace:', this.src);">
                    <img id="layer-shade" class="absolute inset-0 w-full h-full object-contain" src="https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/shade/Shade.png" alt="Shade" crossorigin="anonymous" onload="console.log('Image loaded for layer-shade:', this.src);" onerror="console.error('Failed to load image for layer-shade:', this.src);">
                    <img id="layer-hair" class="absolute inset-0 w-full h-full object-contain" alt="" crossorigin="anonymous" onload="console.log('Image loaded for layer-hair:', this.src);" onerror="console.error('Failed to load image for layer-hair:', this.src);">
                    <img id="layer-nose" class="absolute inset-0 w-full h-full object-contain" alt="" crossorigin="anonymous" onload="console.log('Image loaded for layer-nose:', this.src);" onerror="console.error('Failed to load image for layer-nose:', this.src);">
                    <img id="layer-outfit" class="absolute inset-0 w-full h-full object-contain" alt="" crossorigin="anonymous" onload="console.log('Image loaded for layer-outfit:', this.src);" onerror="console.error('Failed to load image for layer-outfit:', this.src);">
                    <img id="layer-props" class="absolute inset-0 w-full h-full object-contain" alt="" crossorigin="anonymous" onload="console.log('Image loaded for layer-props:', this.src);" onerror="console.error('Failed to load image for layer-props:', this.src);">
                </div>
                
                <!-- Action Buttons (no share button now) -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl">
                </div>
            </div>

            <!-- Right Panel: Trait Selection -->
            <div id="trait-selection-panel" class="w-full max-w-[500px] mx-auto bg-white p-6 rounded-lg flex flex-col lg:h-full lg:flex-1 lg:min-w-[320px] lg:max-w-none">
                <!-- Search Input (remains at top) -->
                <div class="w-full mb-4"> 
                    <div class="relative w-full flex items-center">
                        <input type="text" id="search-input" placeholder="search name or trait" class="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
                        <svg class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <div id="search-suggestions" class="hidden"></div>
                    </div>
                </div>

                <div id="controls-container" class="flex flex-col flex-grow overflow-y-auto">
                    </div>

                <!-- Shuffle Button (moved to the bottom of trait-selection-panel) -->
                <div class="w-full mt-0 flex items-center justify-center flex-shrink-0">
                    <button id="shuffle-button" class="w-[95%] mx-auto flex items-center justify-center text-gray-800 font-medium px-4 py-2 rounded-md border-2 border-[#c7e2a1] bg-[#c7e2a1] hover:bg-lime-800 active:bg-lime-900 transition-colors duration-200">
                        shuffle
                        <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                        </svg>
                    </button>
                </div>
                <!-- Share Button (NEWLY ADDED) -->
                <div class="w-full mt-4 flex items-center justify-center flex-shrink-0">
                    <button id="share-button" class="w-[95%] mx-auto flex items-center justify-center text-white font-medium px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200">
                        Share Composition
                        <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.885 12.938 9 12.482 9 12c0-.482-.115-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.632l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </main>

    <div id="share-modal" class="modal hidden">
        <div class="modal-content">
            <span class="close-button" id="close-share-modal">&times;</span>
            <h2 class="text-xl font-bold mb-4">Share Your Avatar</h2>
            <p class="mb-4 text-sm text-gray-600">Download your composition or share on social media!</p>
            
            <div class="flex flex-col space-y-3 mb-4">
                <a id="download-image-btn" download="my-controverse-avatar.png" class="share-option-button download">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Image
                </a>
                <button id="share-x-btn" class="share-option-button x">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.9 3.2c1.7-1 3.4-1.6 5.1-1.9v2.5c-1.3.1-2.6.5-3.9 1.1-1.3.6-2.5 1.5-3.6 2.6-1.1 1.1-1.9 2.4-2.5 3.7-.6 1.3-1 2.6-1.1 4H2.4c.1-1.7.5-3.4 1.2-5 1-2 2.7-3.6 4.6-4.9C9 4.3 11 3.2 13.2 2.5l-.2-.5c-2.3.8-4.5 2-6.5 3.5-2.1 1.5-3.7 3.4-4.8 5.7L0 12.3v.5c0 1.7.4 3.4 1.2 5 1 2 2.7 3.6 4.6 4.9 1.9 1.3 4 2.1 6.2 2.4l.2.5z"/></svg>
                    Share on X
                </button>
                <button id="share-linkedin-btn" class="share-option-button linkedin">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.444-2.136 2.939v5.667H9.59V9.182h3.414v1.564h.046c.477-.9 1.637-1.85 3.37-1.85 3.616 0 4.287 2.37 4.287 5.454v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.139.92-2.063 2.063-2.063 1.14 0 2.064.924 2.064 2.063 0 1.139-.923 2.065-2.064 2.065zM7.062 20.452H3.414V9.182h3.648v11.27zM12.04 0c-6.617 0-12 5.383-12 12s5.383 12 12 12 12-5.383 12-12-5.383-12-12-12z"/></svg>
                    Share on LinkedIn
                </button>
                <button id="copy-hashtags-btn" class="share-option-button copy">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    Copy Hashtags & Text
                </button>
            </div>
            <p class="text-xs text-gray-500">For Instagram / TikTok, please download the image and paste the copied text manually.</p>
        </div>
    </div>

    <script>
        // Use an IIFE to encapsulate the script and prevent global variable conflicts
        (function() {
            // Declare variables in the scope of the IIFE
            let controlsContainer;
            let displayBox;
            let traitSelectionPanel;
            let searchInput;
            let searchSuggestionsContainer;
            let shuffleButton;
            let leftContentPanel;
            let shareButton; 
            let shareModal; 
            let closeShareModalButton; 
            let downloadImageButton; 
            let shareXButton; 
            let shareLinkedinButton; 
            let copyHashtagsButton; 
            
            let allCharacterCompositions; // Declared here for accessibility by all functions

            const traitData = {
                background: [
                    { name: 'Sandy Shore', value: 'bg-yellow-50' },
                    { name: 'Soft Clay', value: 'bg-amber-50' },
                    { name: 'Misty Sage', value: 'bg-emerald-50' },
                    { name: 'Pale Stone', value: 'bg-stone-100' },
                    { name: 'Dusty Rose', value: 'bg-pink-50' },
                    { name: 'Warm Granite', value: 'bg-gray-100' },
                    { name: 'Desert Bloom', value: 'bg-orange-50' },
                    { name: 'River Pebble', value: 'bg-neutral-100' },
                    { name: 'Forest Haze', value: 'bg-green-50' },
                    { name: 'Sunset Glow', value: 'bg-red-50' },
                    { name: 'Morning Dew', value: 'bg-lime-50' },
                    { name: 'Sky Ash', value: 'bg-slate-100' },
                    { name: 'Deep Soil', value: 'bg-zinc-300' },
                    { name: 'Ocean Whisper', value: 'bg-blue-50' },
                    { name: 'Terra Cotta', value: 'bg-red-300' }
                ],
                props: [
                    { name: 'None', imageUrl: '' },
                    { name: "Bob's joint", imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/props/Bob%27s%20joint.png' },
                    { name: "Fidel's cigar", imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/props/Fidel%27s%20Cigar.png' },
                    { name: 'Kalashnikov', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/props/Kalashnikov.png' },
                    { name: 'Podium', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/props/Podium.png' },
                    { name: 'Red Halo', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/props/Red%20Halo.png' },
                    { name: 'White Halo', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/props/White%20Halo.png' },
                ],
                outfit: [
                    { name: 'None', imageUrl: '' },
                    { name: 'Adolf Hitler', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Hitler.png?raw=true' },
                    { name: 'Andy Warhol', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Andy%20Warhol.png' },
                    { name: 'Angela Merkel', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Angela%20Merkel.png' },
                    { name: 'Ayatullah Khamenei', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Khamenei.png?raw=true' },
                    { name: 'Ayatullah Khomeini', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Khomeini.png?raw=true' },
                    { name: 'Bashar Al Assad', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Bashar%20al-Assad.png?raw=true' },
                    { name: 'Bernie Sanders', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Bernie-01.png?raw=true' },
                    { name: 'Biggie', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Biggie.png?raw=true' },
                    { name: 'Bob Marley', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Bob%20Marley.png?raw=true' },
                    { name: 'Che Guevara', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Che%20Guevara.png?raw=true' },
                    { name: 'Christiano Ronaldo', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Ronaldo.png?raw=true' },
                    { name: 'Dalai Lama', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Dalai%20Lama.png?raw=true' },
                    { name: 'Donald Trump', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Donald%20Trump.png?raw=true' },
                    { name: 'Edward Snowden', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Edward%20Snowden.png?raw=true' },
                    { name: 'Elon Musk', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Elon%20Musk.png?raw=true' },
                    { name: 'Emmanuel Macron', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Emmanuel%20Macron.png?raw=true' },
                    { name: 'Fidel Castro', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Fidel%20Castro.png?raw=true' },
                    { name: 'Frida Kahlo', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Frida%20Kahlo.png?raw=true' },
                    { name: 'Greta Thurnberg', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Greta%20Thurnberg.png?raw=true' },
                    { name: 'Hassan Nasrallah', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Hassan%20Nasrallah.png?raw=true' },
                    { name: 'Henry Kissinger', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Henry%20Kissinger.png?raw=true' },
                    { name: 'Jeremy Corbyn', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Jeremy%20Corbyn-01.png?raw=true' },
                    { name: 'Joe Biden', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Joe%20Biden.png?raw=true' },
                    { name: 'John Lennon', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/John%20Lennon.png?raw=true' },
                    { name: 'Julan Assange T-shirt', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Julian%20Assange%20Tshirt.png?raw=true' },
                    { name: 'Julian Assange', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Julian%20Assange.png?raw=true' },
                    { name: 'Julian Assange Jacket', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Julian%20Assange%20Jacket.png?raw=true' },
                    { name: 'Kim Jong Un', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Kim%20Jong%20Un.png?raw=true' },
                    { name: 'Kim Kardashian', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Kim%20Kardashian.png?raw=true' },
                    { name: 'Kim Kardashian Hoodie', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Kim%20Kardashian%20-%20Hoodie.png?raw=true' },
                    { name: 'Lady Diana', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Lady%20D.png?raw=true' },
                    { name: 'Lionel Messi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Lionel%20Messi.png?raw=true' },
                    { name: 'Mahatma Gandhi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Mahatma%20Gandhi.png?raw=true' },
                    { name: 'Marilyn Monroe', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Marilyn%20Monroe.png?raw=true' },
                    { name: 'Mark Zuckerberg', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Mark%20Zuckerberg.png?raw=true' },
                    { name: 'Martin Luther King', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Martin%20Luther%20King.png?raw=true' },
                    { name: 'Michael Jackson', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Michael%20Jackson%20-%20Red.png?raw=true' },
                    { name: 'Michael Jackson black', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Michael%20Jackson%20-%20Black.png?raw=true' },
                    { name: 'Michael Jordan', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Michael%20Jordan.png?raw=true' },
                    { name: 'Mike Tyson', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Mike%20Tyson.png?raw=true' },
                    { name: 'Mohammed bin Rashid Al Maktoum', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Mohammed%20bin%20Rashid%20Al%20Maktoum.png?raw=true' },
                    { name: 'Mohammed bin Salman', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Mohammed%20bin%20Salman%20Al%20Saud.png?raw=true' },
                    { name: 'Mother Theresa', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Mother%20Theresa.png?raw=true' },
                    { name: 'Narendra Modi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Narendra%20Modi.png?raw=true' },
                    { name: 'Nelson Mandela', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Nelson%20Mandela.png?raw=true' },
                    { name: 'Olaf Scholz', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Olaf%20Scholz.png?raw=true' },
                    { name: 'Oprah Winfrey', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Oprah%20Winfrey.png?raw=true' },
                    { name: 'Pope Francis', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Pope%20Francis.png?raw=true' },
                    { name: 'Recep Tayyip Erdogan', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Recep%20Tayyip%20Erdog%CC%86an.png?raw=true' },
                    { name: 'Saddam Hussein', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Saddam%20Hussein.png?raw=true' },
                    { name: 'Salvador Dali', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Dali.png?raw=true' },
                    { name: 'Serena Williams', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Serena%20Williams.png?raw=true' },
                    { name: 'Snoop Dog', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Snoop%20Dog.png?raw=true' },
                    { name: 'Steve Jobs', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Steve%20Jobs.png?raw=true' },
                    { name: 'The Controverse T (blue)', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Controverse%20Shirt%20-%20Blue-01.png?raw=true' },
                    { name: 'The Controverse T (pink)', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Controverse%20Shirt-Pink.png?raw=true' },
                    { name: 'Tupac', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Tupac.png?raw=true' },
                    { name: 'Ursula Von Der Leyen', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Ursula%20von%20der%20Leyen.png?raw=true' },
                    { name: 'Vladimir Putin', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Vladimir%20Putin.png?raw=true' },
                    { name: 'Volodymyr Zelensky', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Volodymyr%20Zelenskyy.png?raw=true' },
                    { name: 'Xi Jinping', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Xi%20Jinping.png?raw=true' },
                    { name: 'Yasser Arafat', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/outfit/Yasser%20Arafat.png?raw=true' }
                ],
                nose: [
                    { name: 'None', imageUrl: '' },
                    { name: 'Adolf Hitler', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Hitler.png?raw=true' },
                    { name: 'Andy Warhol', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Andy-Warhol.png?raw=true' },
                    { name: 'Angela Merkel', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Angela-Merkel.png?raw=true' },
                    { name: 'Ayatullah Khamenei', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Khamenei.png?raw=true' },
                    { name: 'Ayatullah Khomeini', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Khomeini.png?raw=true' },
                    { name: 'Bashar Al Assad', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Bashar-al-Assad.png?raw=true' },
                    { name: 'Bernie Sanders', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Bernie-Sanders.png?raw=true' },
                    { name: 'Biggie', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Biggie.png?raw=true' },
                    { name: 'Bob Marley', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Bob-Marley.png?raw=true' },
                    { name: 'Che Guevara', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Che-Guevara.png?raw=true' },
                    { name: 'Christiano Ronaldo', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Ronaldo.png?raw=true' },
                    { name: 'Dalai Lama', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Dalai-Lama.png?raw=true' },
                    { name: 'Donald Trump', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Donald-Trump.png?raw=true' },
                    { name: 'Edward Snowden', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Edward-Snowden.png?raw=true' },
                    { name: 'Elon Musk', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Elon-Musk.png?raw=true' },
                    { name: 'Emmanuel Macron', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Emmanuel-Macron.png?raw=true' },
                    { name: 'Fidel Castro', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Fidel-Castro.png?raw=true' },
                    { name: 'Frida Kahlo', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Frida.png?raw=true' },
                    { name: 'Greta Thurnberg', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Greta-Thunberg.png?raw=true' },
                    { name: 'Hassan Nasrallah', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Hassan-Nasrallah.png?raw=true' },
                    { name: 'Henry Kissinger', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Henry-Kissinger.png?raw=true' },
                    { name: 'Jeremy Corbyn', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Jeremy-Corbyn.png?raw=true' },
                    { name: 'Joe Biden', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Joe-Biden.png?raw=true' },
                    { name: 'John Lennon', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/John-Lennon.png?raw=true' },
                    { name: 'Julian Assange', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Julian-Assange.png?raw=true' },
                    { name: 'Kim Jong Un', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Kim-Jong-Un.png?raw=true' },
                    { name: 'Kim Kardashian', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Kim-Kardashian.png?raw=true' },
                    { name: 'Lady Diana', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Lady-D.png?raw=true' },
                    { name: 'Lionel Messi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Lionel-Messi.png?raw=true' },
                    { name: 'Mahatma Gandhi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Mahatma-Gandhi.png?raw=true' },
                    { name: 'Marilyn Monroe', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Marilyn-Monroe.png?raw=true' },
                    { name: 'Mark Zuckerberg', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Mark-Zuckerberg.png?raw=true' },
                    { name: 'Martin Luther King', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Martin-Luther-King.png?raw=true' },
                    { name: 'Michael Jackson', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Michael-Jackson.png?raw=true' },
                    { name: 'Michael Jordan', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Michael-Jordan.png?raw=true' },
                    { name: 'Mike Tyson', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Mike-Tyson.png?raw=true' },
                    { name: 'Mohammed bin Rashid Al Maktoum', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Mohammed-bin-Rashid-Al-Maktoum.png?raw=true' },
                    { name: 'Mohammed bin Salman', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Mohammed-bin-Salman-Al-Saud.png?raw=true' },
                    { name: 'Mother Theresa', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Mother-Theresa.png?raw=true' },
                    { name: 'Narendra Modi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Narendra-Modi.png?raw=true' },
                    { name: 'Nelson Mandela', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Nelson-Mandela.png?raw=true' },
                    { name: 'Olaf Scholz', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Olaf-Scholz.png?raw=true' },
                    { name: 'Oprah Winfrey', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Oprah-Winfrey.png?raw=true' },
                    { name: 'Pope Francis', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Pope-Francis.png?raw=true' },
                    { name: 'Queen Elizabeth II', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Queen-Elizabeth-II.png?raw=true' },
                    { name: 'Recep Tayyip Erdogan', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Recep-Tayyip-Erdog%CC%86an.png?raw=true' },
                    { name: 'Saddam Hussein', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Saddam-Hussein.png?raw=true' },
                    { name: 'Salvador Dali', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Dali.png?raw=true' },
                    { name: 'Serena Williams', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Serena-Williams.png?raw=true' },
                    { name: 'Snoop Dog', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Snoop-Dog.png?raw=true' },
                    { name: 'Steve Jobs', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Steve-Jobs.png?raw=true' },
                    { name: 'Tupac', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Tupac.png?raw=true' },
                    { name: 'Ursula Von der Leyen', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Ursula-von-der-Leyen.png?raw=true' },
                    { name: 'Vladimir Putin', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Vladimir-Putin.png?raw=true' },
                    { name: 'Volodymyr Zelensky', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Volodymyr-Zelenskyy.png?raw=true' },
                    { name: 'Xi Jinping', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Xi-Jinping.png?raw=true' },
                    { name: 'Yasser Arafat', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/nose/Yasser-Arafat.png?raw=true' }
                ],
                hair: [
                    { name: 'None', imageUrl: '' },
                    { name: 'Adolf Hitler', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Hitler.png?raw=true' },
                    { name: 'Andy Warhol', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Andy-Warhol.png' },
                    { name: 'Angela Merkel', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Angela%20Merkel.png' },
                    { name: 'Ayatullah Khamenei', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Khamenei.png?raw=true' },
                    { name: 'Ayatullah Khomeini', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Khomeini.png?raw=true' },
                    { name: 'Bashar Al Assad', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Bashar-al-Assad.png' },
                    { name: 'Bernie Sanders', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Bernie-Sanders.png' },
                    { name: 'Biggie', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Biggie.png' },
                    { name: 'Bob Marley', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Bob-Marley.png' },
                    { name: 'Che Guevara', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Che-Guevara.png?raw=true' },
                    { name: 'Cristiano Ronaldo', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/refs/heads/main/hair/Ronaldo.png?raw=true' },
                    { name: 'Dalai Lama', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Dalai-Lama.png?raw=true' },
                    { name: 'Donald Trump', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Donald-Trump.png?raw=true' },
                    { name: 'Edward Snowden', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Edward-Snowden.png?raw=true' },
                    { name: 'Elon Musk', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Elon-Musk.png?raw=true' },
                    { name: 'Emmanuel Macron', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Emmanuel-Macron.png?raw=true' },
                    { name: 'Fidel Castro', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Fidel-Castro.png?raw=true' },
                    { name: 'Frida Kahlo', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Frida.png?raw=true' },
                    { name: 'Greta Thunberg', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Greta-Thunberg.png?raw=true' },
                    { name: 'Hassan Nasrallah', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Hassan-Nasrallah.png?raw=true' },
                    { name: 'Henry Kissinger', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Henry-Kissinger.png?raw=true' },
                    { name: 'Jeremy Corbyn', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Jeremy-Corbyn.png?raw=true' },
                    { name: 'Joe Biden', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Joe-Biden.png?raw=true' },
                    { name: 'John Lennon', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/John-Lennon-2.png?raw=true' },
                    { name: 'John Lennon (long)', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/John-Lennon-1.png?raw=true' },
                    { name: 'Julian Assange', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Julian-Assange.png?raw=true' },
                    { name: 'Kim Jong Un', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Kim%20Jong%20Un.png?raw=true' },
                    { name: 'Kim Kardashian', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Kim%20Kardashian%20-Brunette.png?raw=true' },
                    { name: 'Kim Kardashian (blond)', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Kim%20Kardashian%20-%20%20Blond.png?raw=true' },
                    { name: 'Lady Diana', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Lady-D.png?raw=true' },
                    { name: 'Lionel Messi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Lionel-Messi.png?raw=true' },
                    { name: 'Mahatma Gandhi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Mahatma-Gandhi.png?raw=true' },
                    { name: 'Marilyn Monroe', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Marilyn-Monroe.png?raw=true' },
                    { name: 'Mark Zuckerberg', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Mark-Zuckerberg.png?raw=true' },
                    { name: 'Martin Luther King', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Martin-Luther-King.png?raw=true' },
                    { name: 'Michael Jackson', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Michael-Jackson.png?raw=true' },
                    { name: 'Michael Jordan', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Michael-Jordan.png?raw=true' },
                    { name: 'Mike Tyson', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Mike-Tyson.png?raw=true' },
                    { name: 'Mohammed bin Rashid Al Maktoum', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Mohammed-bin-Rashid-Al-Maktoum.png?raw=true' },
                    { name: 'Mohammed bin Salman', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Mohammed-bin-Salman-Al-Saud.png?raw=true' },
                    { name: 'Mother Theresa', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Mother-Theresa.png?raw=true' },
                    { name: 'Narendra Modi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Narendra-Modi.png?raw=true' },
                    { name: 'Nelson Mandela', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Nelson-Mandela.png?raw=true' },
                    { name: 'Olaf Scholz', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Olaf-Scholz.png?raw=true' },
                    { name: 'Oprah Winfrey', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Oprah-Winfrey.png?raw=true' },
                    { name: 'Pope Francis', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Pope-Francis.png?raw=true' },
                    { name: 'Queen Elizabeth II', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Queen-Elizabeth-II.png?raw=true' },
                    { name: 'Recep Tayyip Erdogan', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Recep-Tayyip-Erdog%CC%86an.png?raw=true' },
                    { name: 'Saddam Hussein', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Saddam-Hussein.png?raw=true' },
                    { name: 'Salvador Dali', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Dali.png?raw=true' },
                    { name: 'Serena Williams', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Serena-Williams.png?raw=true' },
                    { name: 'Snoop Dog', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Snoop-Dog.png?raw=true' },
                    { name: 'Steve Jobs', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Steve-Jobs.png?raw=true' },
                    { name: 'Tupac', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Tupac.png?raw=true' },
                    { name: 'Tupac (cap)', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Tupac%20Cap.png?raw=true' },
                    { name: 'Ursula Von der Leyen', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Ursula-von-der-Leyen.png?raw=true' },
                    { name: 'Vladimir Putin', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Vladimir-Putin.png?raw=true' },
                    { name: 'Volodymyr Zelensky', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Volodymyr-Zelenskyy.png?raw=true' },
                    { name: 'Xi Jinping', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Xi-Jinping.png?raw=true' },
                    { name: 'Yasser Arafat', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/hair/Yasser-Arafat.png?raw=true' }
                ],
                upperFace: [
                    { name: 'None', imageUrl: '' },
                    { name: 'Adolf Hitler', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Hitler.png?raw=true' },
                    { name: 'Andy Warhol', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Andy-Warhol.png' },
                    { name: 'Angela Merkel', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Angela-Merkel.png' },
                    { name: 'Ayatullah Khamenei', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Khamenei.png?raw=true' },
                    { name: 'Ayatullah Khomeini', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Khomeini.png?raw=true' },
                    { name: 'Bashar Al Assad', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Bashar-al-Assad.png' },
                    { name: 'Bernie Sanders', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Bernie-Sanders.png' },
                    { name: 'Biggie', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Biggie.png' },
                    { name: 'Bob Marley', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Bob-Marley.png' },
                    { name: 'Che Guevara', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Che-Guevara.png?raw=true' },
                    { name: 'Cristiano Ronaldo', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Ronaldo.png?raw=true' },
                    { name: 'Dalai Lama', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/dalai-lama.png?raw=true' },
                    { name: 'Donald Trump', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Donald-Trump.png?raw=true' },
                    { name: 'Edward Snowden', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Edward-Snowden.png?raw=true' },
                    { name: 'Elon Musk', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Elon-Musk.png?raw=true' },
                    { name: 'Emmanuel Macron', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Emmanuel-Macron.png?raw=true' },
                    { name: 'Fidel Castro', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Fidel-Castro.png?raw=true' },
                    { name: 'Frida Kahlo', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Frida.png?raw=true' },
                    { name: 'Greta Thurnberg', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Greta-Thunberg.png?raw=true' },
                    { name: 'Hassan Nasrallah', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Hassan-Nasrallah.png?raw=true' },
                    { name: 'Henry Kissinger', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Henry-Kissinger.png?raw=true' },
                    { name: 'Jeremy Corbyn', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Jeremy-Corbyn.png?raw=true' },
                    { name: 'Joe Biden', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Joe-Biden.png?raw=true' },
                    { name: 'John Lennon', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/John-Lennon.png?raw=true' },
                    { name: 'Julian Assange', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Julian-Assange.png?raw=true' },
                    { name: 'Kim Jong Un', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Kim-Jong-Un.png?raw=true' },
                    { name: 'Kim Kardashian', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Kim-Kardashian.png?raw=true' },
                    { name: 'Lady Diana', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Lady-D.png?raw=true' },
                    { name: 'Lionel Messi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Lionel-Messi.png?raw=true' },
                    { name: 'Mahatma Gandhi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Mahatma-Gandhi.png?raw=true' },
                    { name: 'Marilyn Monroe', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Marilyn-Monroe.png?raw=true' },
                    { name: 'Mark Zuckerberg', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Mark-Zuckerberg.png?raw=true' },
                    { name: 'Martin Luther King', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Martin-Luther-King.png?raw=true' },
                    { name: 'Michael Jackson', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Michael-Jackson.png?raw=true' },
                    { name: 'Michael Jordan', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Michael-Jordan.png?raw=true' },
                    { name: 'Mike Tyson', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Mike-Tyson.png?raw=true' },
                    { name: 'Mohammed bin Rashid Al Maktoum', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Mohammed-bin-Rashid-Al-Maktoum.png?raw=true' },
                    { name: 'Mohammed bin Salman', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Mohammed-bin-Salman-Al-Saud.png?raw=true' },
                    { name: 'Mother Theresa', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Mother-Theresa.png?raw=true' },
                    { name: 'Narendra Modi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Narendra-Modi.png?raw=true' },
                    { name: 'Nelson Mandela', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Nelson-Mandela.png?raw=true' },
                    { name: 'Olaf Scholz', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Olaf-Scholz.png?raw=true' },
                    { name: 'Oprah Winfrey', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Oprah-Winfrey.png?raw=true' },
                    { name: 'Pope Francis', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Pope-Francis.png?raw=true' },
                    { name: 'Queen Elizabeth II', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Queen-Elizabeth-II.png?raw=true' },
                    { name: 'Recep Tayyip Erdogan', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Recep-Tayyip-Erdog%CC%86an.png?raw=true' },
                    { name: 'Saddam Hussein', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Saddam-Hussein.png?raw=true' },
                    { name: 'Salvador Dali', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Dali.png?raw=true' },
                    { name: 'Serena Williams', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Serena-Williams.png?raw=true' },
                    { name: 'Snoop Dog', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Snoop-Dog.png?raw=true' },
                    { name: 'Steve Jobs', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Steve-Jobs.png?raw=true' },
                    { name: 'Tupac', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Tupac.png?raw=true' },
                    { name: 'Ursula Von der Leyen', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Ursula-von-der-Leyen.png?raw=true' },
                    { name: 'Vladimir Putin', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Vladimir-Putin.png?raw=true' },
                    { name: 'Volodymyr Zelensky', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Volodymyr-Zelenskyy.png?raw=true' },
                    { name: 'Xi Jinping', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Xi-Jinping.png?raw=true' },
                    { name: 'Yasser Arafat', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/upperface/Yasser-Arafat.png?raw=true' }
                ],
                lowerFace: [
                    { name: 'None', imageUrl: '' },
                    { name: 'Adolf Hitler', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Hitler.png?raw=true' },
                    { name: 'Ayatullah Khamenei', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Khamenei.png?raw=true' },
                    { name: 'Ayatullah Khomeini', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Khomeini.png?raw=true' },
                    { name: 'Andy Warhol', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Andy%20Warhol.png' },
                    { name: 'Angela Merkel', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Angela%20Merkel.png' },
                    { name: 'Bashar Al Assad', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Bashar%20al-Assad.png' },
                    { name: 'Bernie Sanders', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Bernie%20Sanders.png' },
                    { name: 'Biggie', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Biggie.png' },
                    { name: 'Bob Marley', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Bob%20Marley.png' },
                    { name: 'Che Guevara', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Che%20Guevara.png?raw=true' },
                    { name: 'Christiano Ronaldo', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Ronaldo.png?raw=true' },
                    { name: 'Dalai Lama', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Dalai%20Lama.png?raw=true' },
                    { name: 'Donald Trump', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Donald%20Trump.png?raw=true' },
                    { name: 'Edward Snowden', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Edward%20Snowden.png?raw=true' },
                    { name: 'Elon Musk', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Elon%20Musk.png?raw=true' },
                    { name: 'Emmanuel Macron', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Emmanuel%20Macron.png?raw=true' },
                    { name: 'Fidel Castro', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Fidel%20Castro.png?raw=true' },
                    { name: 'Frida Kahlo', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Frida%20Kahlo.png?raw=true' },
                    { name: 'Greta Thurnberg', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Greta%20Thurnberg.png?raw=true' },
                    { name: 'Hassan Nasrallah', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Hassan%20Nasrallah.png?raw=true' },
                    { name: 'Henry Kissinger', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Henry%20Kissinger.png?raw=true' },
                    { name: 'Jeremy Corbyn', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Jeremy%20Corbyn.png?raw=true' },
                    { name: 'Joe Biden', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Joe%20Biden.png?raw=true' },
                    { name: 'John Lennon', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/John%20Lennon%202.png?raw=true' },
                    { name: 'John Lennon (beard)', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/John%20Lennon%201.png?raw=true' },
                    { name: 'Julian Assange', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Julian%20Assange.png?raw=true' },
                    { name: 'Kim Jong Un', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Kim%20Jong%20Un.png?raw=true' },
                    { name: 'Kim Kardashian', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Kim%20Kardashian.png?raw=true' },
                    { name: 'Lady Diana', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Lady%20D.png?raw=true' },
                    { name: 'Lionel Messi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Lionel%20Messi.png?raw=true' },
                    { name: 'Mahatma Gandhi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Mahatma%20Gandhi.png?raw=true' },
                    { name: 'Marilyn Monroe', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Marilyn%20Monroe.png?raw=true' },
                    { name: 'Mark Zuckerberg', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Mark%20Zuckerberg.png?raw=true' },
                    { name: 'Martin Luther King', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Martin%20Luther%20King.png?raw=true' },
                    { name: 'Michael Jackson', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Michael%20Jackson.png?raw=true' },
                    { name: 'Michael Jordan', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Michael%20Jordan.png?raw=true' },
                    { name: 'Mike Tyson', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Mike%20Tyson.png?raw=true' },
                    { name: 'Mohammed bin Rashid Al Maktoum', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Mohammed%20bin%20Rashid%20Al%20Maktoum.png?raw=true' },
                    { name: 'Mohammed bin Salman', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Mohammed%20bin%20Salman%20Al%20Saud.png?raw=true' },
                    { name: 'Mother Theresa', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Mother%20Theresa.png?raw=true' },
                    { name: 'Narendra Modi', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Narendra%20Modi.png?raw=true' },
                    { name: 'Nelson Mandela', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Nelson%20Mandela.png?raw=true' },
                    { name: 'Olaf Scholz', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Olaf%20Scholz.png?raw=true' },
                    { name: 'Oprah Winfrey', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Oprah%20Winfrey.png?raw=true' },
                    { name: 'Pope Francis', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Pope%20Francis.png?raw=true' },
                    { name: 'Queen Elizabeth II', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Queen%20Elizabeth%20II.png?raw=true' },
                    { name: 'Recep Tayyip Erdogan', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Recep%20Tayyip%20Erdog%CC%86an.png?raw=true' },
                    { name: 'Saddam Hussein', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Saddam%20Hussein.png?raw=true' },
                    { name: 'Salvador Dali', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Dali.png?raw=true' },
                    { name: 'Serena Williams', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Serena%20Williams.png?raw=true' },
                    { name: 'Snoop Dog', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Snoop%20Dog.png?raw=true' },
                    { name: 'Steve Jobs', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Steve%20Jobs.png?raw=true' },
                    { name: 'Tupac', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Tupac.png?raw=true' },
                    { name: 'Ursula Von der Leyen', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Ursula%20von%20der%20Leyen.png?raw=true' },
                    { name: 'Vladimir Putin', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Vladimir%20Putin.png?raw=true' },
                    { name: 'Volodymyr Zelensky', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Volodymyr%20Zelenskyy.png?raw=true' },
                    { name: 'Xi Jinping', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Xi%20Jinping.png?raw=true' },
                    { name: 'Yasser Arafat', imageUrl: 'https://raw.githubusercontent.com/TonyKhoueiry/Controverse-Assets/main/lowerface/Yasser%20Arafat.png?raw=true' }
                ],
            };
            
            const categoryOrder = ['hair', 'upperFace', 'nose', 'lowerFace', 'outfit', 'props', 'background'];
            
            // Declare functions here (hoisted) for proper scope
            function createDropdowns() {
                // Clear existing dropdowns first to prevent duplicates on re-init
                controlsContainer.innerHTML = ''; 

                categoryOrder.forEach(categoryKey => {
                    let traits = [...traitData[categoryKey]]; // Create a copy to sort
                    const readableName = categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                    // Separate 'None' option if it exists
                    const noneTrait = traits.find(trait => trait.name === 'None');
                    let sortedTraits = traits.filter(trait => trait.name !== 'None');

                    // Sort the remaining traits alphabetically
                    sortedTraits.sort((a, b) => a.name.localeCompare(b.name));

                    // Prepend 'None' if it existed
                    if (noneTrait) {
                        sortedTraits.unshift(noneTrait);
                    }

                    const container = document.createElement('div');
                    container.className = 'mb-4'; // Increased margin-bottom to mb-4

                    const label = document.createElement('label');
                    label.htmlFor = `select-${categoryKey}`;
                    label.className = 'block text-gray-700 text-sm font-bold mb-0';
                    label.textContent = readableName;

                    const select = document.createElement('select');
                    select.id = `select-${categoryKey}`;
                    select.className = 'block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md leading-tight focus:outline-none focus:ring-0 transition-shadow'; /* Removed focus:ring-2 focus:ring-blue-500 */
                    
                    sortedTraits.forEach(trait => { // Use sortedTraits here
                        const option = document.createElement('option');
                        option.textContent = trait.name;
                        option.value = categoryKey === 'background' ? trait.value : trait.imageUrl; 
                        select.appendChild(option);
                    });
                    
                    // Set default for 'props' to 'None' (empty string)
                    if (categoryKey === 'props') {
                        select.value = ''; 
                    }

                    select.addEventListener('change', updateDisplay);

                    container.appendChild(label);
                    container.appendChild(select);
                    controlsContainer.appendChild(container);
                });
            }

            function updateDisplay() {
                categoryOrder.forEach(categoryKey => {
                    const select = document.getElementById(`select-${categoryKey}`);
                    const selectedValue = select.value;

                    // Handle background separately as it's a class on displayBox
                    if (categoryKey === 'background') {
                        const bgClasses = traitData.background.map(t => t.value);
                        displayBox.classList.remove(...bgClasses);
                        traitSelectionPanel.classList.remove(...bgClasses);

                        displayBox.classList.add(selectedValue);
                        traitSelectionPanel.classList.add(selectedValue);
                    } else {
                        const imgLayer = document.getElementById(`layer-${categoryKey}`);
                        if(imgLayer) {
                            if (selectedValue === '') {
                                // If 'None' is selected, ensure no src is set and hide the element
                                imgLayer.removeAttribute('src'); // Safest way to ensure no loading attempt
                                imgLayer.style.display = 'none';
                                imgLayer.alt = '';
                            } else {
                                // If a valid trait is selected, set src and display the element
                                imgLayer.src = selectedValue;
                                imgLayer.style.display = 'block';
                                const selectedTraitObj = traitData[categoryKey].find(trait => trait.imageUrl === selectedValue);
                                imgLayer.alt = selectedTraitObj ? selectedTraitObj.name : 'Trait image';
                            }
                        }
                    }
                });
                adjustPanelHeight();
            }

            function shuffle() {
                console.log('Shuffling composition...');
                categoryOrder.forEach(categoryKey => {
                    const select = document.getElementById(`select-${categoryKey}`);
                    const traits = traitData[categoryKey];
                    let randomTrait;

                    // Handle background separately as it's a class on displayBox and can always be random
                    if (categoryKey === 'background') {
                        const randomIndex = Math.floor(Math.random() * traits.length);
                        randomTrait = traits[randomIndex];
                    } else if (categoryKey === 'props') { // Keep props as 'None' on shuffle
                        randomTrait = traits.find(t => t.name === 'None');
                        if (!randomTrait) {
                            console.warn("No 'None' option found for props category. Defaulting to first trait.");
                            randomTrait = traits[0]; 
                        }
                    } 
                    else {
                        const selectableTraits = traits.filter(t => t.name !== 'None');
                        if (selectableTraits.length > 0) {
                            const randomIndex = Math.floor(Math.random() * selectableTraits.length);
                            randomTrait = selectableTraits[randomIndex];
                        } else {
                            randomTrait = { name: 'None', imageUrl: '' };
                        }
                    }
                    
                    select.value = (categoryKey === 'background' ? randomTrait.value : randomTrait.imageUrl);
                    console.log(`Shuffled ${categoryKey} to:`, randomTrait.name);
                });
                updateDisplay();
                console.log('Shuffle complete.');
            }

            function adjustPanelHeight() {
                if (leftContentPanel && traitSelectionPanel) {
                    if (window.innerWidth >= 1024) {
                        const leftContentHeight = displayBox.offsetHeight; // Use displayBox height for alignment
                        traitSelectionPanel.style.height = `${leftContentHeight}px`;
                        controlsContainer.classList.add('flex', 'flex-col', 'justify-start');
                        controlsContainer.style.height = '100%'; // Allow controls container to fill available height
                        controlsContainer.style.overflowY = 'auto'; // Make controls container scrollable
                        traitSelectionPanel.style.overflowY = 'hidden'; // Hide overflow for the panel
                    } else {
                        traitSelectionPanel.style.height = '';
                        traitSelectionPanel.style.overflowY = 'visible';
                        controlsContainer.classList.remove('flex', 'flex-col', 'justify-start');
                        controlsContainer.style.height = '';
                        controlsContainer.style.overflowY = 'visible';
                    }
                }
            }

            // Function to generate hashtags from selected traits (no changes here)
            function getSelectedTraitsAsHashtags() {
                let hashtags = ["#thecontroverse"];
                categoryOrder.forEach(categoryKey => {
                    const select = document.getElementById(`select-${categoryKey}`);
                    if (select) {
                        const selectedOptionText = select.options[select.selectedIndex].textContent;
                        if (selectedOptionText && selectedOptionText !== 'None') {
                            const formattedTrait = selectedOptionText.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
                            if (formattedTrait) {
                                hashtags.push(`#${formattedTrait}`);
                            }
                        }
                    }
                });
                return hashtags.join(' ');
            }

            // Function to copy text to clipboard (no changes here)
            async function copyToClipboard(text) {
                try {
                    await navigator.clipboard.writeText(text);
                    console.log('Text copied to clipboard using Clipboard API:', text);
                } catch (err) {
                    console.error('Failed to copy text using Clipboard API:', err);
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        document.execCommand('copy');
                        console.log('Text copied to clipboard using execCommand:', text);
                    } catch (err2) {
                        console.error('Failed to copy text using execCommand:', err2);
                    } finally {
                        document.body.removeChild(textarea);
                    }
                }
            }

            // Function to handle sharing the composition
            async function shareComposition() {
                console.log('Attempting to share composition...');
                shareModal.style.display = 'flex'; // Show the modal

                try {
                    // Use scale to capture higher resolution if needed, then draw to a smaller canvas for display
                    const canvas = await html2canvas(displayBox, {
                        allowTaint: true, // Allow images from other origins to be drawn
                        useCORS: true,   // Attempt to load images using CORS (they must support it)
                        scale: 2, // Capture at 2x resolution for better quality
                        backgroundColor: null // Transparent background if displayBox itself has none
                    });

                    // Ensure the downloaded image is of good quality.
                    // The 'type' and 'quality' parameters are for toDataURL.
                    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9); // Use JPEG for smaller file size, adjust quality

                    downloadImageButton.href = imageDataUrl;

                    const shareText = "Check out my new avatar composition! ";
                    const hashtags = getSelectedTraitsAsHashtags();
                    const fullShareText = `${shareText} ${hashtags}`;
                    console.log('Generated share text:', fullShareText);

                    // X (Twitter) Share
                    shareXButton.onclick = () => {
                        const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullShareText)}`;
                        window.open(xUrl, '_blank');
                    };

                    // LinkedIn Share
                    shareLinkedinButton.onclick = () => {
                        const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(fullShareText)}&source=AvatarCustomizer`;
                        window.open(linkedinUrl, '_blank');
                    };

                    // Copy Hashtags & Text to Clipboard
                    copyHashtagsButton.onclick = () => {
                        copyToClipboard(fullShareText);
                    };

                    console.log('Share options prepared.');

                } catch (error) {
                    console.error('Error generating image for sharing:', error);
                    alert('Could not prepare image for sharing. Please try again or check console for errors.');
                    shareModal.style.display = 'none'; // Hide modal if error occurs
                }
            }

            // filterAndDisplaySuggestions function
            function filterAndDisplaySuggestions() {
                const query = searchInput.value.toLowerCase().trim();
                searchSuggestionsContainer.innerHTML = '';

                if (query.length < 2) {
                    searchSuggestionsContainer.classList.add('hidden');
                    return;
                }

                let suggestions = [];
                let hasCompositionMatch = false;

                // Prioritize exact or strong matches for compositions
                for (const lowerName in allCharacterCompositions) {
                    if (lowerName.includes(query)) {
                        const charData = allCharacterCompositions[lowerName];
                        suggestions.push({
                            type: 'composition',
                            displayText: `${charData.name} (Full Composition)`,
                            traits: charData.traits,
                            relevance: lowerName.startsWith(query) ? 2 : 1 // Higher relevance for startsWith
                        });
                        hasCompositionMatch = true;
                    }
                }

                // Add individual trait matches, but deprioritize if a composition match is strong
                if (!hasCompositionMatch || query.length >= 3) { // Show traits if no composition match or if query is long enough
                    for (const categoryKey in traitData) {
                        const readableCategoryName = categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        // Ensure traitData[categoryKey] is an array before attempting to iterate
                        if (Array.isArray(traitData[categoryKey])) {
                            traitData[categoryKey].forEach(trait => {
                                if (trait.name !== 'None' && trait.name.toLowerCase().includes(query)) {
                                    suggestions.push({
                                        type: 'trait',
                                        displayText: `${trait.name} (${readableCategoryName})`,
                                        category: categoryKey,
                                        value: categoryKey === 'background' ? trait.value : trait.imageUrl,
                                        relevance: trait.name.toLowerCase().startsWith(query) ? 2 : 1 // Higher relevance for startsWith
                                    });
                                }
                            });
                        }
                    }
                }

                // Sort suggestions: compositions first, then by relevance, then alphabetically
                suggestions.sort((a, b) => {
                    if (a.type === 'composition' && b.type !== 'composition') return -1;
                    if (a.type !== 'composition' && b.type === 'composition') return 1;
                    if (b.relevance !== a.relevance) return b.relevance - a.relevance;
                    return a.displayText.localeCompare(b.displayText);
                });


                if (suggestions.length > 0) {
                    suggestions.forEach(match => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.className = 'suggestion-item';
                        if (match.type === 'composition') {
                            suggestionItem.classList.add('composition-suggestion');
                        }
                        
                        suggestionItem.textContent = match.displayText;
                        suggestionItem.dataset.type = match.type;
                        suggestionItem.dataset.category = match.category || '';
                        suggestionItem.dataset.value = match.value || ''; // Ensure value is always set

                        if (match.type === 'composition') {
                            suggestionItem.compositionTraits = match.traits; 
                        }

                        suggestionItem.addEventListener('mousedown', function(e) {
                            e.preventDefault(); 
                        });

                        suggestionItem.addEventListener('click', function() {
                            const clickedType = this.dataset.type;

                            if (clickedType === 'composition') {
                                const traitsToApply = this.compositionTraits;
                                for (const charCategory in traitsToApply) {
                                    const charTraitValue = traitsToApply[charCategory];
                                    const targetSelect = document.getElementById(`select-${charCategory}`);
                                    if (targetSelect) {
                                        targetSelect.value = charTraitValue;
                                    }
                                }
                                // Ensure background is handled if it's part of a composition or defaults
                                const backgroundSelect = document.getElementById('select-background');
                                if (backgroundSelect && traitsToApply.background) {
                                    backgroundSelect.value = traitsToApply.background;
                                } else if (backgroundSelect) {
                                    // If composition doesn't specify background, default to a known one
                                    const defaultBg = traitData.background.find(t => t.name === 'Warm Granite')?.value || traitData.background[0].value;
                                    backgroundSelect.value = defaultBg;
                                }

                            } else { // It's an individual trait
                                const selectedCategory = this.dataset.category;
                                const selectedValue = this.dataset.value;
                                const targetSelect = document.getElementById(`select-${selectedCategory}`);
                                if (targetSelect) {
                                    targetSelect.value = selectedValue;
                                }
                            }
                            updateDisplay();
                            searchInput.value = '';
                            searchSuggestionsContainer.classList.add('hidden');
                        });
                        searchSuggestionsContainer.appendChild(suggestionItem);
                    });
                    searchSuggestionsContainer.classList.remove('hidden');
                } else {
                    searchSuggestionsContainer.classList.add('hidden');
                }
            }

            // init function
            function init() {
                console.log('Initializing app - Version: 2024-06-20-v63'); // Updated version stamp

                // Assign references here to ensure DOM is loaded
                controlsContainer = document.getElementById('controls-container');
                displayBox = document.getElementById('display-box');
                traitSelectionPanel = document.getElementById('trait-selection-panel');
                searchInput = document.getElementById('search-input');
                searchSuggestionsContainer = document.getElementById('search-suggestions');
                shuffleButton = document.getElementById('shuffle-button'); 
                leftContentPanel = document.getElementById('left-content-panel');
                shareButton = document.getElementById('share-button'); 
                shareModal = document.getElementById('share-modal'); 
                closeShareModalButton = document.getElementById('close-share-modal'); 
                downloadImageButton = document.getElementById('download-image-btn'); 
                shareXButton = document.getElementById('share-x-btn'); 
                shareLinkedinButton = document.getElementById('share-linkedin-btn'); 
                copyHashtagsButton = document.getElementById('copy-hashtags-btn'); 
                
                // Initialize allCharacterCompositions here, ensuring it's defined within the IIFE scope
                allCharacterCompositions = {};
                for (const categoryKey in traitData) {
                    // Check if traitData[categoryKey] is an array before iterating
                    if (Array.isArray(traitData[categoryKey])) { // Removed the `&& categoryKey !== 'background'` condition
                        traitData[categoryKey].forEach(trait => {
                            if (trait.name !== 'None') {
                                const lowerName = trait.name.toLowerCase();
                                if (!allCharacterCompositions[lowerName]) {
                                    allCharacterCompositions[lowerName] = { name: trait.name, traits: {} };
                                }
                                allCharacterCompositions[lowerName].traits[categoryKey] = (categoryKey === 'background' ? trait.value : trait.imageUrl); // Store correct value type
                            }
                        });
                    }
                }

                // Add background for existing compositions (e.g., if "Andy Warhol" has a default background)
                // This part needs to be manually defined if characters have specific backgrounds
                // For now, it will use the current background or default to 'Warm Granite' if not specified in search.
                // Example: allCharacterCompositions['andy warhol'].traits.background = 'bg-red-100';

                console.log('allCharacterCompositions initialized:', Object.keys(allCharacterCompositions).length, 'characters found.');

                // Attach event listeners
                if (shuffleButton) {
                    shuffleButton.addEventListener('click', shuffle);
                    console.log('Shuffle button event listener added.');
                } else {
                    console.error('Shuffle button not found at init time.');
                }
                
                if (searchInput) {
                    searchInput.addEventListener('input', filterAndDisplaySuggestions);
                    searchInput.addEventListener('focus', filterAndDisplaySuggestions);
                    searchInput.addEventListener('blur', function() {
                        // Delay hiding to allow click on suggestions
                        setTimeout(() => {
                            searchSuggestionsContainer.classList.add('hidden');
                        }, 200); 
                    });
                    console.log('Search input event listener added.');
                } else {
                    console.error('Search input not found.');
                }

                // Re-added share button event listener
                if (shareButton) {
                    shareButton.addEventListener('click', shareComposition);
                    console.log('Share button event listener added.');
                } else {
                    console.error('Share button not found at init time.');
                }

                // Re-added close share modal event listener
                if (closeShareModalButton) {
                    closeShareModalButton.addEventListener('click', () => {
                        shareModal.style.display = 'none';
                    });
                }

                createDropdowns(); 
                shuffle(); // Initial random composition
                adjustPanelHeight(); 
                window.addEventListener('resize', adjustPanelHeight);

                console.log('App initialization complete.');
            }

            // Call init directly when the script is parsed, as it's within an IIFE.
            init(); 
        })(); // IIFE ends here
    </script>
</body>
</html>
