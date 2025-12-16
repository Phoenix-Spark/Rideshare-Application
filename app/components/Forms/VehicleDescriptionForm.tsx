import { useState } from "react";

export default function VehicleDescriptionForm() {
  const colors = [
    {
      bg: "bg-black",
      label: "Black",
    }, 
    {
      bg: "bg-white", 
      label: "White",
    },
    { 
      bg:"bg-gray-500", 
      label: "Gray",
    },
    {
      bg: "bg-yellow-950",
      label: "Brown",
    },
    {
      bg:"bg-green-400",
      label: "Green"
    },
    {
      bg: "bg-blue-400", 
      label: "Blue",
    },
    {
      bg: "bg-red-500", 
      label: "Red"
    },
    {
      bg: "bg-yellow-500",
      label: "Yellow"
    }, 
    {
      bg:"bg-orange-500", 
      label: "Other"
    }]

  const [colorBox, showColorBox] = useState(false);
  const [carColor, setCarColor] = useState("");

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold text-gray-900">Add New Vehicle</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          type="text"
          name="year"
          maxLength={4}
          placeholder="Year"
          required
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        />
        <input
          type="text"
          name="make"
          maxLength={15}
          placeholder="Make"
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        />
        <input
          type="text"
          name="model"
          maxLength={15}
          placeholder="Model"
          required
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        />
        <button
          name="color"
          type="button"
          className="rounded-xl text-left border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
          onClick={() => showColorBox(!colorBox)}
          >
            Color
            {/* {colors.map((c, index) => <option className="text-gray-900 border-2 border-black" value={c.label.toLowerCase()}>{c.label}</option>)} */}
        </button>
        {/* <input
          type="text"
          name="color"
          maxLength={15}
          placeholder="Color"
          required
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        /> */}
        <input
          type="text"
          name="plate"
          maxLength={15}
          placeholder="Plate"
          required
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
        />
        <input type="hidden" name="color" value={carColor} />
        {colorBox && (
          <div className="col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-4 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300">
            {colors.map((c, index) => (
              <div
                key={index}
                className={`inline-flex items-center gap-2 text-slate-800 p-2 rounded-lg hover:bg-slate-200 hover:border-2 cursor-pointer transition-colors ${
                  c.label === carColor 
                    ? "bg-slate-200 border-2 border-slate-400" 
                    : "border-2 border-transparent"
                }`}
                onClick={() => {
                  setCarColor(prev => prev === c.label ? "" : c.label);
                }}
              >
                <div className={`rounded-full w-8 h-8 flex-shrink-0 border-2 border-gray-500 ${c.bg}`} />
                <p className="truncate flex-1 min-w-0">{c.label}</p>
              </div>
            ))}
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
