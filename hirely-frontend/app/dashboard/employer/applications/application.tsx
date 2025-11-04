"use client";

import { Download, MoreVertical } from "lucide-react";
import { useState } from "react";

interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  job_company: string;
  job_location: string;
  resume: string;
  resume_filename: string;
  expected_salary: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  applied_at: string;
  time_since_applied: string;
  viewed_by_employer: boolean;
}

interface ApplicationsTableProps {
  applications: Application[];
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onDownloadResume: (url: string, fileName: string) => void;
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
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Applied For
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Resume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-neutral-500">
                  No applications yet
                </td>
              </tr>
            ) : (
              applications.map((app, index) => (
                <tr key={app.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {index + 1}
                  </td>
                  
                  {/* Applicant Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {app.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-900">
                          {app.full_name}
                        </div>
                        <div className="text-xs text-neutral-500">
                          ID: {app.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Job Applied For */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-neutral-900">
                      {app.job_title}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {app.job_location}
                    </div>
                  </td>
                  
                  {/* Contact Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      {app.email}
                    </div>
                    {app.phone && (
                      <div className="text-xs text-neutral-500">
                        {app.phone}
                      </div>
                    )}
                  </td>
                  
                  {/* Applied Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    <div>{app.time_since_applied}</div>
                    {app.viewed_by_employer ? (
                      <div className="text-xs text-green-600">✓ Viewed</div>
                    ) : (
                      <div className="text-xs text-blue-600 font-medium">● New</div>
                    )}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      app.status === 'withdrawn' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status === 'pending' ? 'Under Review' : 
                       app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  
                  {/* Resume */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onDownloadResume(app.resume, app.resume_filename || `${app.full_name}_resume`)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                  {/* Actions */}
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
                            {app.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    onAccept(app.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 transition-colors"
                                >
                                  ✓ Accept
                                </button>
                                <button
                                  onClick={() => {
                                    onReject(app.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  ✗ Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                onDownloadResume(app.resume, app.resume_filename || `${app.full_name}_resume`);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              📄 Resume
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