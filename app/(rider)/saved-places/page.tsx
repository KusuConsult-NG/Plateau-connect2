'use client'

import { FiHome, FiBriefcase, FiMapPin, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

const SAVED_PLACES = [
    { id: 1, type: 'Home', address: '15 Rwang Pam Street, Jos', icon: FiHome, color: 'text-blue-500' },
    { id: 2, type: 'Work', address: 'Standard Building, Jos', icon: FiBriefcase, color: 'text-orange-500' },
    { id: 3, type: 'Gym', address: 'Rayfield Resort', icon: FiMapPin, color: 'text-purple-500' },
]

export default function SavedPlacesPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8 animate-slideUp">
                <div>
                    <h1 className="text-3xl font-bold mb-2 gradient-text">Saved Places</h1>
                    <p className="text-dark-text-secondary">Manage your favorite destinations for quick access.</p>
                </div>
                <button className="btn-success px-4 py-2 text-sm font-bold flex items-center space-x-2">
                    <FiPlus />
                    <span>Add New</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideIn">
                {SAVED_PLACES.map((place) => (
                    <div key={place.id} className="card-glass group p-5 flex items-start justify-between hover:bg-dark-bg-tertiary/40 transition-all border border-dark-border hover:border-primary/40">
                        <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-xl bg-dark-bg-tertiary flex items-center justify-center text-xl ${place.color} shadow-lg`}>
                                <place.icon />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{place.type}</h3>
                                <p className="text-sm text-dark-text-secondary mt-1 max-w-[200px]">{place.address}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-primary/20 rounded-lg text-primary transition-colors">
                                <FiEdit2 />
                            </button>
                            <button className="p-2 hover:bg-error/20 rounded-lg text-error transition-colors">
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
