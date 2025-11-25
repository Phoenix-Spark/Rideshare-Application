import { Form, useActionData } from "react-router";
import { useState } from "react";
import { XMarkIcon } from "~/components/Icons/XMarkIcon";
import { BanIcon } from "~/components/Icons/BanIcon";
import { EyeClosedIcon } from "~/components/Icons/EyeClosedIcon";
import { EyeOpenIcon } from "~/components/Icons/EyeOpenIcon";
import { RefreshIcon } from "~/components/Icons/RefreshIcon";
import { CheckMarkIcon } from "~/components/Icons/CheckMarkIcon";

export default function UserInviteForm({ invite }: any) {
  const actionData = useActionData();
  const [visible, setVisible] = useState<{ [key: string]: boolean }>({});

  const toggleVisibility = (id: string) => {
    setVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-indigo-500 pl-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-1">
          Invite Friends & Family
        </h3>
        <p className="text-gray-500 text-sm">
          Use your invite keys to add family and friends to your account.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            Send an Invite
          </h4>
          <p className="text-sm text-gray-500">
            Enter the email of the person you want to invite.
          </p>
        </div>

        <Form
          method="post"
          action="/dashboard/settings?tab=invites"
          className="space-y-5"
        >
          <input type="hidden" name="intent" value="create-invite" />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="friend@example.com"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold 
                       py-3 rounded-xl shadow-md transition-all active:scale-95"
          >
            Generate Invite Key
          </button>
        </Form>
      </div>

      <div className="bg-gray-50 space-y-4 rounded-xl">
        {actionData?.error && (
          <div className="p-3 ml-29 text-center rounded-lg bg-red-100 w-100 border border-red-300 text-red-700">
            {actionData.error}
          </div>
        )}

        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-gray-900">Your Invites</h4>

          {(() => {
            const maxInvites = 5;
            const remaining = maxInvites - invite.length;

            let bgColor = "bg-green-500";
            if (remaining <= 2 && remaining > 0) bgColor = "bg-yellow-400";
            if (remaining === 0) bgColor = "bg-red-500";

            return (
              <p
                className={`text-white text-sm py-1 px-3 rounded-full font-semibold ${bgColor}`}
              >
                {remaining} / {maxInvites} left
              </p>
            );
          })()}
        </div>

        <div className="space-y-4">
          {invite?.length === 0 && (
            <p className="text-gray-500 text-sm">No invites created yet.</p>
          )}

          {invite?.map((inv: any) => {
            const show = visible[inv.id];

            return (
              <div
                key={inv.id}
                className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="grid grid-cols-6 items-center">
                  <div className="truncate col-span-2 w-full">
                    <p className="text-sm text-gray-900 font-semibold truncate">
                      {inv.email}
                    </p>
                    <div className="text-xs text-gray-500 flex flex-col">
                      <span>
                        Created: {new Date(inv.createdAt).toLocaleString()}
                      </span>
                      <span>
                        Updated: {new Date(inv.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full ml-6 justify-center col-span-2">
                    {inv.isActive ? (
                      <p className="font-mono text-sm px-3 py-1 text-black rounded-full border border-green-500 bg-green-200 text-center truncate w-40">
                        {show ? inv.code : "**********"}
                      </p>
                    ) : (
                      <p className="font-mono max-w-40 text-sm px-3 py-1 text-black rounded-full border border-red-500 bg-red-200 text-center">
                        key disabled
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end w-46 gap-2">
                    {inv.isActive && (
                      <button
                        type="button"
                        onClick={() => toggleVisibility(inv.id)}
                        className="rounded-lg hover:bg-gray-100 transition"
                        title={show ? "Hide code" : "Show code"}
                      >
                        {show ? (
                          <EyeClosedIcon className="text-gray-700 size-7" />
                        ) : (
                          <EyeOpenIcon className="text-gray-700 size-7" />
                        )}
                      </button>
                    )}

                    {inv.isActive && (
                      <Form
                        method="post"
                        action="/dashboard/settings?tab=invites"
                      >
                        <input
                          type="hidden"
                          name="intent"
                          value="regenerate-invite"
                        />
                        <input type="hidden" name="id" value={inv.id} />
                        {new Date().getTime() -
                          new Date(inv.updatedAt).getTime() >
                        60_000 ? (
                          <button
                            type="submit"
                            className="rounded-lg hover:bg-blue-100 transition"
                          >
                            <RefreshIcon className="text-blue-600 size-7" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="rounded-lg transition"
                            title="Please wait 1 minute to regenerate this key"
                          >
                            <RefreshIcon className="cursor-not-allowed text-gray-300 size-7" />
                          </button>
                        )}
                      </Form>
                    )}

                    <Form
                      method="post"
                      action="/dashboard/settings?tab=invites"
                    >
                      <input
                        type="hidden"
                        name="intent"
                        value={
                          inv.isActive ? "disable-invite" : "enable-invite"
                        }
                      />
                      <input type="hidden" name="id" value={inv.id} />
                      <button
                        type="submit"
                        className={`rounded-lg transition ${
                          inv.isActive
                            ? "hover:bg-yellow-100"
                            : "hover:bg-green-100"
                        }`}
                        title={inv.isActive ? "Disable Key" : "Enable Key"}
                      >
                        {inv.isActive ? (
                          <BanIcon className="text-yellow-600 size-7" />
                        ) : (
                          <CheckMarkIcon className="text-green-600 size-7" />
                        )}
                      </button>
                    </Form>

                    <Form
                      method="post"
                      action="/dashboard/settings?tab=invites"
                    >
                      <input
                        type="hidden"
                        name="intent"
                        value="delete-invite"
                      />
                      <input type="hidden" name="id" value={inv.id} />
                      <button
                        type="submit"
                        className="rounded-lg hover:bg-red-100 transition"
                        title="Delete Key"
                      >
                        <XMarkIcon className="text-red-600 size-7" />
                      </button>
                    </Form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
