import { useNavigate } from "react-router";

export default function ButtonControls({
  saveLabel = "Save Changes",
  cancelLabel = "Cancel",
}: any) {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-end gap-4 mt-8 pt-6">
      <button
        type="button"
        onClick={handleCancel}
        className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-300 hover:scale-105"
      >
        {cancelLabel}
      </button>

      <button
        type="submit"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
      >
        {saveLabel}
      </button>
    </div>
  );
}
