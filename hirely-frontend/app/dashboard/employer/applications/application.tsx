"use client";

import { Download, MoreVertical } from "lucide-react";
import { useState } from "react";

interface Application {
  id: number;
  user_name: string;
  user_avatar?: string;
  job_title: string;
  location: string;
  resume_url: string;
  status?: string;
}

interface ApplicationsTableProps {
  applications: Application[];
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onDownloadResume: (url: string, userName: string) => void;
}

export default function ApplicationsTable({
  applications,
  onAccept,
  onReject,
  onDownloadResume,
}: ApplicationsTableProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                User name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Resume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                  No applications yet
                </td>
              </tr>
            ) : (
              applications.map((app, index) => (
                <tr key={app.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {app.user_avatar ? (
                          <img
                            src={app.user_avatar}
                            alt={app.user_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          app.user_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-sm font-medium text-neutral-900">
                        {app.user_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {app.job_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {app.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onDownloadResume(app.resume_url, app.user_name)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100 transition-colors"
                    >
                      Resume
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === app.id ? null : app.id)
                        }
                        className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-neutral-600" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === app.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-neutral-200 py-1 z-20">
                            <button
                              onClick={() => {
                                onAccept(app.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => {
                                onReject(app.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}