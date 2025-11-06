import { useState } from "react";
import { createPortal } from "react-dom";
import { WarningIcon } from "~/components/Icons/WarningIcon";

export default function UserDeleteForm({ user }: any) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const isEmailMatch = deleteConfirmEmail.trim().toLowerCase() === user?.email?.toLowerCase();
  
  const modal = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <form method="post" action="/dashboard/settings">
        <input type="hidden" name="userId" value={user?.id} />
        <input type="hidden" name="intent" value="user-delete" />
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-[500px] p-8 border border-gray-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <WarningIcon className="text-red-500 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Confirm Account Deletion
            </h3>
            <p className="text-gray-600">
              Type your email{" "}
              <span className="font-semibold text-red-600">{user?.email}</span>{" "}
              to confirm.
            </p>
          </div>
          
          <input
            type="email"
            value={deleteConfirmEmail}
            onChange={(e) => setDeleteConfirmEmail(e.target.value)}
            required
            className="w-full text-black rounded-xl border-2 border-gray-300 px-4 py-3 mb-6 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300"
            placeholder="Enter your email"
          />
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmEmail("");
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-300 hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isEmailMatch}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                isEmailMatch
                  ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white hover:shadow-xl hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
              }`}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  );
  
  return (
    <div className="flex flex-col min-h-full space-y-6">
      <div className="border-l-4 border-red-500 pl-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Delete Account
        </h3>
        <p className="text-gray-500">
          Permanently remove your account and all data
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 shadow-md border-2 border-red-200">
        <div className="flex items-start gap-4">
          <WarningIcon className="text-red-500 w-10 h-10" />
          <div>
            <h4 className="font-bold text-red-900 text-lg mb-2">
              Warning: This action is irreversible
            </h4>
            <p className="text-red-700">
              Deleting your account will permanently remove all your data,
              settings, and access. This cannot be undone.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-auto">
        <button
          type="button"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </button>
      </div>
      
      {showDeleteModal && createPortal(modal, document.body)}
    </div>
  );
}