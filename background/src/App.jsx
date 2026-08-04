    {/* Cut Selection */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">1. Choose Cut:</h3>
      <div className="flex flex-wrap gap-3">
        {['crew-neck', 'v-neck'].map((cut) => (
          <button
            key={cut}
            onClick={() => setSelectedCut(cut)}
            className={`px-4 py-2 rounded-lg border-2 font-medium capitalize transition-all duration-200
              ${selectedCut === cut
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
              }`}
          >
            {cut.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>

    {/* Color Selection */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">2. Choose Color:</h3>
      <div className="flex flex-wrap gap-3">
        {availableColors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center
              ${selectedColor === color ? 'ring-4 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300'}`}
            style={{ backgroundColor: color, borderColor: color === '#ffffff' ? '#ccc' : color }}
            title={color}
          >
            {selectedColor === color && (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="color"
          value={newColorInput}
          onChange={(e) => setNewColorInput(e.target.value)}
          className="w-10 h-10 rounded-md border-gray-300 shadow-sm"
          title="Pick a color"
        />
        <input
          type="text"
          placeholder="e.g., #FF0000"
          value={newColorInput}
          onChange={(e) => setNewColorInput(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddColor}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Add Color
        </button>
      </div>
    </div>

    {/* Size Selection */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">3. Choose Size:</h3>
      <div className="flex flex-wrap gap-3">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200
              ${selectedSize === size
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
              }`}
          >
            {size}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="e.g., XXXL"
          value={newSizeInput}
          onChange={(e) => setNewSizeInput(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddSize}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Add Size
        </button>
      </div>
    </div>

    {/* Design Library */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">4. Select Design:</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {availableDesigns.map((design) => (
          <button
            key={design.id}
            onClick={() => setSelectedDesign(design)}
            className={`p-3 border-2 rounded-lg flex items-center justify-center transition-all duration-200
              ${selectedDesign?.id === design.id
                ? 'border-blue-600 ring-2 ring-blue-500 shadow-md'
                : 'border-gray-300 hover:border-blue-400'
              }`}
            title={design.alt}
          >
            <div
              dangerouslySetInnerHTML={{ __html: design.src }}
              className="w-12 h-12 text-gray-700"
            />
          </button>
        ))}
        <button
          onClick={() => setSelectedDesign(null)}
          className={`p-3 border-2 rounded-lg flex items-center justify-center transition-all duration-200 text-sm
            ${selectedDesign === null
              ? 'border-blue-600 ring-2 ring-blue-500 shadow-md bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 bg-gray-100'
            }`}
        >
          No Design
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <textarea
          placeholder="Paste SVG code here (<svg>...</svg>)"
          value={newDesignSvgInput}
          onChange={(e) => setNewDesignSvgInput(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <input
          type="text"
          placeholder="Design Label / Alt Text"
          value={newDesignAltInput}
          onChange={(e) => setNewDesignAltInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddDesign}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Add Custom Design
        </button>
      </div>
    </div>
  </div>

  {/* T-Shirt Display Section */}
  <div className="w-full lg:w-2/3 p-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Custom T-Shirt</h2>
    <div
      ref={tShirtRef}
      className={`relative w-full max-w-sm aspect-square rounded-lg flex items-center justify-center overflow-hidden border-4 border-gray-200 transition-colors duration-300
        ${selectedCut === 'crew-neck' ? 'rounded-t-full' : 'rounded-t-lg'}
      `}
      style={{ backgroundColor: selectedColor }}
    >
      {/* T-shirt image mockup */}
      <img
        src="/CNSM_W.jpg"
        alt="T-Shirt Mockup"
        className="absolute inset-0 w-full h-full object-contain"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/400x400/CCCCCC/000000?text=T-Shirt+Image";
        }}
      />

      {selectedDesign && (
        <div
          className={`absolute w-24 h-24 flex items-center justify-center transition-transform duration-100 ease-out
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            left: `calc(50% + ${designPosition.x}px)`,
            top: `calc(50% + ${designPosition.y}px)`,
            transform: 'translate(-50%, -50%)',
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {selectedDesign.src.startsWith('<svg') ? (
            <div dangerouslySetInnerHTML={{ __html: selectedDesign.src }} className="w-full h-full text-gray-900" />
          ) : (
            <img src={selectedDesign.src} alt={selectedDesign.alt} className="w-full h-full object-contain" />
          )}
        </div>
      )}
    </div>

    <button
      onClick={handleOrder}
      className="mt-8 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-lg uppercase tracking-wide"
    >
      Order Your Custom T-Shirt
    </button>
  </div>

  {/* Order Summary Modal */}
  {showModal && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h3>
        <pre className="bg-gray-100 p-4 rounded-md text-sm whitespace-pre-wrap break-words">
          {modalContent}
        </pre>
        <button
          onClick={() => setShowModal(false)}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  )}
</div>
