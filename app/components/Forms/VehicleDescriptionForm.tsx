import { useState } from "react";

export default function VehicleDescriptionForm() {
  const colors = [
    { bg: "bg-black", label: "Black", hex: "#000000" }, 
    { bg: "bg-white", label: "White", hex: "#FFFFFF" },
    { bg:"bg-gray-500", label: "Gray", hex: "#6B7280" },
    { bg: "bg-yellow-950", label: "Brown", hex: "#422006" },
    { bg:"bg-green-400", label: "Green", hex: "#4ADE80" },
    { bg: "bg-blue-400", label: "Blue", hex: "#60A5FA" },
    { bg: "bg-red-500", label: "Red", hex: "#EF4444" },
    { bg: "bg-yellow-500", label: "Yellow", hex: "#EAB308" }
  ];

  const makes = [
    "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "BMW", "Mercedes-Benz",
    "Volkswagen", "Hyundai", "Kia", "Mazda", "Subaru", "Jeep", "Ram", "GMC",
    "Lexus", "Audi", "Tesla", "Dodge", "Chrysler", "Other"
  ];

  const modelsByMake = {
    "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "4Runner", "Prius", "Sienna", "Other"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "HR-V", "Ridgeline", "Passport", "Other"],
    "Ford": ["F-150", "Escape", "Explorer", "Mustang", "Edge", "Ranger", "Expedition", "Bronco", "Other"],
    "Chevrolet": ["Silverado", "Equinox", "Malibu", "Traverse", "Tahoe", "Suburban", "Colorado", "Blazer", "Other"],
    "Nissan": ["Altima", "Rogue", "Sentra", "Pathfinder", "Frontier", "Murano", "Maxima", "Armada", "Other"],
    "BMW": ["3 Series", "5 Series", "X3", "X5", "X1", "4 Series", "7 Series", "X7", "Other"],
    "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "A-Class", "S-Class", "GLA", "GLB", "Other"],
    "Volkswagen": ["Jetta", "Tiguan", "Atlas", "Passat", "Taos", "ID.4", "Golf", "Arteon", "Other"],
    "Hyundai": ["Elantra", "Tucson", "Sonata", "Santa Fe", "Kona", "Palisade", "Venue", "Ioniq", "Other"],
    "Kia": ["Forte", "Sportage", "Sorento", "Telluride", "Soul", "Seltos", "K5", "Carnival", "Other"],
    "Mazda": ["Mazda3", "CX-5", "CX-9", "CX-30", "Mazda6", "MX-5 Miata", "CX-50", "Other"],
    "Subaru": ["Outback", "Forester", "Crosstrek", "Impreza", "Ascent", "Legacy", "WRX", "BRZ", "Other"],
    "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Gladiator", "Renegade", "Wagoneer", "Other"],
    "Ram": ["1500", "2500", "3500", "ProMaster", "Other"],
    "GMC": ["Sierra", "Terrain", "Acadia", "Yukon", "Canyon", "Other"],
    "Lexus": ["RX", "ES", "NX", "IS", "GX", "UX", "LS", "LX", "Other"],
    "Audi": ["A4", "Q5", "Q7", "A3", "A6", "Q3", "e-tron", "Q8", "Other"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Other"],
    "Dodge": ["Charger", "Challenger", "Durango", "Ram", "Journey", "Other"],
    "Chrysler": ["Pacifica", "300", "Voyager", "Other"]
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 126}, (_, i) => currentYear - i);

  const [colorBox, showColorBox] = useState(false);
  const [carColorHex, setCarColorHex] = useState("");
  const [carColorLabel, setCarColorLabel] = useState("");
  const [customColor, setCustomColor] = useState("#000000");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [customMake, setCustomMake] = useState("");
  const [customModel, setCustomModel] = useState("");

  const availableModels = selectedMake && modelsByMake[selectedMake] ? modelsByMake[selectedMake] : [];

  const handleColorSelect = (hex: any, label: any) => {
    setCarColorHex(hex);
    setCarColorLabel(label);
    showColorBox(false);
  };

  const handleCustomColorChange = (e: any) => {
    const hex = e.target.value;
    setCustomColor(hex);
    setCarColorHex(hex);
    setCarColorLabel("Custom");
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold text-gray-900">Add New Vehicle</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <select
          name="year"
          required
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        >
          <option value="">Year</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          name="make"
          required
          value={selectedMake}
          onChange={(e) => {
            setSelectedMake(e.target.value);
            setSelectedModel("");
            setCustomMake("");
          }}
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        >
          <option value="">Make</option>
          {makes.map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>

        {selectedMake === "Other" ? (
          <input
            type="text"
            name="customMake"
            value={customMake}
            onChange={(e) => setCustomMake(e.target.value)}
            minLength={1}
            maxLength={50}
            placeholder="Enter make"
            required
            className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
          />
        ) : null}

        <select
          name="model"
          required
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            setCustomModel("");
          }}
          disabled={!selectedMake || selectedMake === "Other"}
          className={`rounded-xl border-2 border-gray-200 px-4 py-2.5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 ${
            !selectedMake || selectedMake === "Other" 
              ? "text-gray-400 bg-gray-50 cursor-not-allowed" 
              : "text-gray-900 bg-white"
          }`}
        >
          <option value="">Model</option>
          {availableModels.map((model: any) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>

        {selectedModel === "Other" || selectedMake === "Other" ? (
          <input
            type="text"
            name="customModel"
            value={customModel}
            onChange={(e) => setCustomModel(e.target.value)}
            minLength={1}
            maxLength={50}
            placeholder="Enter model"
            required
            className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
          />
        ) : null}

        <button
          name="colorButton"
          type="button"
          className="rounded-xl text-left border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 flex items-center gap-2"
          onClick={() => showColorBox(!colorBox)}
        >
          {carColorHex && (
            <div 
              className="w-6 h-6 rounded-full border-2 border-gray-400 flex-shrink-0"
              style={{ backgroundColor: carColorHex }}
            />
          )}
          <span>{carColorLabel || "Color"}</span>
        </button>

        <input
          type="text"
          name="plate"
          maxLength={10}
          placeholder="Plate"
          required
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        />

        <input type="hidden" name="color" value={carColorHex} />
        
        {colorBox && (
          <div className="col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-4 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 transition-all duration-300">
            {colors.map((c, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                aria-pressed={carColorHex === c.hex}
                className={`inline-flex items-center gap-2 text-slate-800 p-2 rounded-lg hover:bg-slate-200 hover:border-2 cursor-pointer transition-colors ${
                  carColorHex === c.hex 
                    ? "bg-slate-200 border-2 border-slate-400" 
                    : "border-2 border-transparent"
                }`}
                onClick={() => handleColorSelect(c.hex, c.label)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleColorSelect(c.hex, c.label);
                  }
                }}
              >
                <div className={`rounded-full w-8 h-8 flex-shrink-0 border-2 border-gray-500 ${c.bg}`} />
                <p className="truncate flex-1 min-w-0">{c.label}</p>
              </div>
            ))}
            
            {/* Custom Color Picker */}
            <div className="inline-flex items-center gap-2 text-slate-800 p-2 rounded-lg hover:bg-slate-200 hover:border-2 border-2 border-transparent transition-colors">
              <label className="inline-flex items-center gap-2 cursor-pointer flex-1">
                <div 
                  className="rounded-full w-8 h-8 flex-shrink-0 border-2 border-gray-500 relative overflow-hidden"
                  style={{
                    background: 'conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)'
                  }}
                >
                  <input
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
                <p className="truncate flex-1 min-w-0">Custom</p>
              </label>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-all duration-300"
      >
        Add Vehicle
      </button>
    </div>
  );
}