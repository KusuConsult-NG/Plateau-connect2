'use client'

import { FiUser, FiBell, FiLock, FiLogOut, FiChevronRight } from 'react-icons/fi'

export default function SettingsPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8 gradient-text animate-slideUp">Settings</h1>

            <div className="space-y-6 animate-slideIn">
                {/* Profile Section */}
                <div className="card-glass p-0 overflow-hidden">
                    <div className="p-6 border-b border-dark-border/50">
                        <h2 className="text-xl font-bold text-white mb-1">Profile Information</h2>
                        <p className="text-sm text-dark-text-secondary">Update your personal details and vehicle info.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center space-x-4 pb-4 border-b border-dark-border/30 last:border-0 last:pb-0 cursor-pointer hover:bg-dark-bg-tertiary/30 -mx-6 px-6 py-4 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <FiUser />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-white">Personal Info</p>
                                <p className="text-xs text-dark-text-secondary">Name, Email, Phone</p>
                            </div>
                            <FiChevronRight className="text-dark-text-secondary" />
                        </div>
                        {/* More items */}
                    </div>
                </div>

                {/* Preferences */}
                <div className="card-glass p-0 overflow-hidden">
                    <div className="p-6 border-b border-dark-border/50">
                        <h2 className="text-xl font-bold text-white mb-1">Preferences</h2>
                        <p className="text-sm text-dark-text-secondary">Manage notifications and security.</p>
                    </div>
                    <div className="p-0">
                        <div className="group flex items-center space-x-4 p-6 border-b border-dark-border/30 cursor-pointer hover:bg-dark-bg-tertiary/30 transition-colors">
                            <FiBell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                            <div className="flex-1">
                                <p className="font-semibold text-white">Notifications</p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-success cursor-pointer"></label>
                            </div>
                        </div>
                        <div className="group flex items-center space-x-4 p-6 cursor-pointer hover:bg-dark-bg-tertiary/30 transition-colors">
                            <FiLock className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                            <div className="flex-1">
                                <p className="font-semibold text-white">Security</p>
                                <p className="text-xs text-dark-text-secondary">Password, 2FA</p>
                            </div>
                            <FiChevronRight className="text-dark-text-secondary" />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button className="w-full py-4 rounded-xl border border-error/30 text-error hover:bg-error hover:text-white transition-all font-bold flex items-center justify-center space-x-2">
                        <FiLogOut />
                        <span>Log Out</span>
                    </button>
                    <p className="text-center text-xs text-dark-text-secondary mt-4">Plateau Connect Driver App v1.0.0</p>
                </div>
            </div>
        </div>
    )
}
