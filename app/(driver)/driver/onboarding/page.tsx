'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FiUpload, FiCheck } from 'react-icons/fi'

const STEPS = [
    'Personal Details',
    'Vehicle Information',
    'Documents',
    'Bank Details',
]

export default function DriverOnboarding() {
    const router = useRouter()
    const { data: session } = useSession()
    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        // Personal Details
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        profilePicture: null as File | null,
        profilePicturePreview: '',

        // Vehicle Information
        vehicleType: 'STANDARD',
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        vehicleColor: '',
        licensePlate: '',

        // Documents - Driver's License
        licenseNumber: '',
        licenseExpiry: '',
        licenseFrontImage: null as File | null,
        licenseFrontPreview: '',
        licenseBackImage: null as File | null,
        licenseBackPreview: '',

        // Documents - Vehicle
        vehicleRegistration: null as File | null,
        vehicleRegistrationPreview: '',
        insurance: null as File | null,
        insurancePreview: '',

        // KYC Documents - National ID
        nationalIdType: 'NIN',
        nationalIdNumber: '',
        nationalIdDocument: null as File | null,
        nationalIdPreview: '',

        // KYC Documents - Additional
        proofOfAddress: null as File | null,
        proofOfAddressPreview: '',
        bvn: '',

        // Bank Details
        bankName: '',
        accountNumber: '',
        accountName: '',
    })

    // Pre-populate email from session
    useEffect(() => {
        if (session?.user?.email) {
            setFormData(prev => ({
                ...prev,
                email: session.user.email || '',
            }))
        }
    }, [session])

    const progress = ((currentStep + 1) / STEPS.length) * 100

    const handleNext = async () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            // Submit form
            await handleSubmit()
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setError('')

        try {
            // Helper function to convert File to base64
            const fileToBase64 = (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onload = () => resolve(reader.result as string)
                    reader.onerror = error => reject(error)
                })
            }

            // Convert all files to base64
            const submissionData: any = { ...formData }

            const fileFields = [
                'profilePicture',
                'licenseFrontImage',
                'licenseBackImage',
                'vehicleRegistration',
                'insurance',
                'nationalIdDocument'
            ]

            for (const field of fileFields) {
                if (formData[field as keyof typeof formData] instanceof File) {
                    submissionData[field] = await fileToBase64(formData[field as keyof typeof formData] as File)
                }
            }

            // Remove preview URLs from submission
            const cleanData = Object.keys(submissionData).reduce((acc: any, key) => {
                if (!key.endsWith('Preview')) {
                    acc[key] = submissionData[key]
                }
                return acc
            }, {})

            const response = await fetch('/api/driver/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create driver profile')
            }

            console.log('Driver profile created successfully:', data)
            router.push('/driver')
        } catch (err) {
            console.error('Form submission error:', err)
            setError(err instanceof Error ? err.message : 'Failed to submit application')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    return (
        <div className="min-h-screen bg-dark-bg flex">
            {/* Sidebar - Why Drive With Us */}
            <aside className="hidden lg:block w-96 bg-dark-bg-secondary border-r border-dark-border p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
                        Plateau Connect
                    </h2>
                    <p className="text-dark-text-secondary text-sm">Driver Partner Application</p>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold">Why Drive With Us?</h3>

                    <div className="space-y-4">
                        <BenefitCard
                            icon="⏰"
                            title="Flexible Hours"
                            description="Drive when you want, where you want. Be your own boss."
                        />
                        <BenefitCard
                            icon="💰"
                            title="Weekly Payouts"
                            description="Get your earnings deposited directly into your bank account every week."
                        />
                        <BenefitCard
                            icon="🛟"
                            title="24/7 Support"
                            description="Our dedicated support team is always here to help you on the road."
                        />
                    </div>

                    <div className="card">
                        <h4 className="font-semibold mb-2">Need Help?</h4>
                        <p className="text-sm text-dark-text-secondary mb-3">
                            If you have any questions during the application process, please visit our{' '}
                            <a href="#" className="text-primary hover:text-primary-light">FAQs</a> or{' '}
                            <a href="#" className="text-primary hover:text-primary-light">contact support</a>.
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main Form Area */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-3xl mx-auto p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            Become a Driver Partner in Plateau State
                        </h1>
                        <div className="flex items-center justify-between">
                            <p className="text-dark-text-secondary">
                                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
                            </p>
                            <span className="text-sm font-medium text-primary">{progress.toFixed(0)}%</span>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Progress Bar */}
                        <div className="w-full bg-dark-bg-tertiary rounded-full h-2 mt-3">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Form Steps */}
                    <div className="card">
                        {currentStep === 0 && <PersonalDetailsStep formData={formData} setFormData={setFormData} />}
                        {currentStep === 1 && <VehicleInformationStep formData={formData} setFormData={setFormData} />}
                        {currentStep === 2 && <DocumentsStep formData={formData} setFormData={setFormData} />}
                        {currentStep === 3 && <BankDetailsStep formData={formData} setFormData={setFormData} />}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="btn-secondary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : currentStep === STEPS.length - 1 ? 'Submit Application' : 'Next Step'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}

function BenefitCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                {icon}
            </div>
            <div>
                <h4 className="font-semibold mb-1">{title}</h4>
                <p className="text-sm text-dark-text-secondary">{description}</p>
            </div>
        </div>
    )
}

function PersonalDetailsStep({ formData, setFormData }: any) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB')
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPEG, PNG)')
            return
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file)
        setFormData({
            ...formData,
            [field]: file,
            [`${field}Preview`]: previewUrl
        })
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">1. Personal Details</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        First Name <span className="text-error">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="input-field"
                        placeholder="Enter your first name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Last Name <span className="text-error">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="input-field"
                        placeholder="Enter your last name"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Email Address <span className="text-error">*</span>
                </label>
                <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="you@example.com"
                    readOnly
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Phone Number <span className="text-error">*</span>
                </label>
                <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    placeholder="+234 800 000 0000"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Residential Address <span className="text-error">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                    placeholder="Enter your street address"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Profile/Passport Photograph <span className="text-error">*</span>
                </label>
                <p className="text-xs text-dark-text-secondary mb-2">
                    Required for KYC verification. Max 2MB, JPEG/PNG only.
                </p>
                <div className="flex items-center space-x-4">
                    {formData.profilePicturePreview ? (
                        <img
                            src={formData.profilePicturePreview}
                            alt="Profile preview"
                            className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-dark-bg-tertiary rounded-full flex items-center justify-center">
                            <FiUpload className="w-6 h-6 text-dark-text-secondary" />
                        </div>
                    )}
                    <div className="flex-1">
                        <input
                            type="file"
                            id="profilePicture"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={(e) => handleFileChange(e, 'profilePicture')}
                            className="hidden"
                        />
                        <label htmlFor="profilePicture" className="btn-secondary cursor-pointer inline-block">
                            {formData.profilePicture ? 'Change Photo' : 'Upload Photo'}
                        </label>
                        {formData.profilePicture && (
                            <p className="text-xs text-success mt-1">✓ {formData.profilePicture.name}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function VehicleInformationStep({ formData, setFormData }: any) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">2. Vehicle Information</h2>

            <div>
                <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="input-field"
                >
                    <option value="ECONOMY">Economy</option>
                    <option value="STANDARD">Standard</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="KEKE">Keke (Tricycle)</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Make</label>
                    <input
                        type="text"
                        value={formData.vehicleMake}
                        onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                        className="input-field"
                        placeholder="e.g., Toyota"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Model</label>
                    <input
                        type="text"
                        value={formData.vehicleModel}
                        onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                        className="input-field"
                        placeholder="e.g., Camry"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <input
                        type="number"
                        value={formData.vehicleYear}
                        onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                        className="input-field"
                        placeholder="2020"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <input
                        type="text"
                        value={formData.vehicleColor}
                        onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
                        className="input-field"
                        placeholder="e.g., Black"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">License Plate Number</label>
                <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    className="input-field"
                    placeholder="ABC-123-XY"
                />
            </div>
        </div>
    )
}

function DocumentsStep({ formData, setFormData }: any) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (max 5MB for documents)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB')
            return
        }

        // Validate file type (images and PDFs)
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
        if (!validTypes.includes(file.type)) {
            alert('Please upload an image (JPEG, PNG) or PDF file')
            return
        }

        // Create preview URL for images
        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
        setFormData({
            ...formData,
            [field]: file,
            [`${field}Preview`]: previewUrl
        })
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">3. KYC Documents</h2>
            <p className="text-sm text-dark-text-secondary mb-4">
                All documents are mandatory for verification and compliance with Nigerian regulations.
            </p>

            {/* Driver's License Section */}
            <div className="space-y-4 p-4 border border-dark-border rounded-lg">
                <h3 className="font-semibold text-primary">Driver's License</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            License Number <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.licenseNumber}
                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                            className="input-field"
                            placeholder="License number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Expiry Date <span className="text-error">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.licenseExpiry}
                            onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                            className="input-field"
                            min={new Date().toISOString().split('T')[0]}
                            max={new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0]}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FileUploadField
                        label="License Front Image"
                        required
                        field="licenseFrontImage"
                        formData={formData}
                        handleFileChange={handleFileChange}
                        accept="image/*,.pdf"
                    />
                    <FileUploadField
                        label="License Back Image"
                        required
                        field="licenseBackImage"
                        formData={formData}
                        handleFileChange={handleFileChange}
                        accept="image/*,.pdf"
                    />
                </div>
            </div>

            {/* Vehicle Documents Section */}
            <div className="space-y-4 p-4 border border-dark-border rounded-lg">
                <h3 className="font-semibold text-primary">Vehicle Documents</h3>

                <div className="grid grid-cols-2 gap-4">
                    <FileUploadField
                        label="Vehicle Registration"
                        required
                        field="vehicleRegistration"
                        formData={formData}
                        handleFileChange={handleFileChange}
                        accept="image/*,.pdf"
                    />
                    <FileUploadField
                        label="Insurance Certificate"
                        required
                        field="insurance"
                        formData={formData}
                        handleFileChange={handleFileChange}
                        accept="image/*,.pdf"
                    />
                </div>
            </div>

            {/* National ID Section */}
            <div className="space-y-4 p-4 border border-dark-border rounded-lg">
                <h3 className="font-semibold text-primary">National Identification</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            ID Type <span className="text-error">*</span>
                        </label>
                        <select
                            required
                            value={formData.nationalIdType}
                            onChange={(e) => setFormData({ ...formData, nationalIdType: e.target.value })}
                            className="input-field"
                        >
                            <option value="NIN">National Identity Number (NIN)</option>
                            <option value="VOTERS_CARD">Permanent Voter's Card</option>
                            <option value="INTL_PASSPORT">International Passport</option>
                            <option value="DRIVERS_LICENSE">Driver's License</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            ID Number <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.nationalIdNumber}
                            onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                            className="input-field"
                            placeholder="Enter ID number"
                        />
                    </div>
                </div>

                <FileUploadField
                    label="National ID Document"
                    required
                    field="nationalIdDocument"
                    formData={formData}
                    handleFileChange={handleFileChange}
                    accept="image/*,.pdf"
                />
            </div>

            {/* Additional Documents Section */}
            <div className="space-y-4 p-4 border border-dark-border rounded-lg">
                <h3 className="font-semibold text-primary">Additional Verification</h3>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Bank Verification Number (BVN)
                        <span className="text-dark-text-secondary text-xs ml-2">(Optional but recommended)</span>
                    </label>
                    <input
                        type="text"
                        value={formData.bvn}
                        onChange={(e) => setFormData({ ...formData, bvn: e.target.value })}
                        className="input-field"
                        placeholder="Enter your 11-digit BVN"
                        maxLength={11}
                    />
                    <p className="text-xs text-dark-text-secondary mt-1">
                        BVN helps with faster verification and payouts
                    </p>
                </div>
            </div>
        </div>
    )
}

function BankDetailsStep({ formData, setFormData }: any) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">4. Bank Details</h2>
            <p className="text-sm text-dark-text-secondary">
                Enter your bank details to receive weekly payouts
            </p>

            <div>
                <label className="block text-sm font-medium mb-2">Bank Name</label>
                <select
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="input-field"
                >
                    <option value="">Select your bank</option>
                    <option value="GTBank">GTBank</option>
                    <option value="Access Bank">Access Bank</option>
                    <option value="UBA">UBA</option>
                    <option value="First Bank">First Bank</option>
                    <option value="Zenith Bank">Zenith Bank</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Account Number</label>
                <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="input-field"
                    placeholder="0123456789"
                    maxLength={10}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Account Name</label>
                <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    className="input-field"
                    placeholder="Account name will auto-populate"
                    readOnly
                />
                <p className="text-xs text-dark-text-secondary mt-1">
                    This will be automatically verified
                </p>
            </div>
        </div>
    )
}

function FileUploadField({
    label,
    accept,
    required = false,
    field = '',
    formData = null,
    handleFileChange = null,
    helpText = ''
}: {
    label: string
    accept: string
    required?: boolean
    field?: string
    formData?: any
    handleFileChange?: ((e: React.ChangeEvent<HTMLInputElement>, field: string) => void) | null
    helpText?: string
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">
                {label} {required && <span className="text-error">*</span>}
            </label>
            {helpText && (
                <p className="text-xs text-dark-text-secondary mb-2">{helpText}</p>
            )}
            <div className="border-2 border-dashed border-dark-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                <FiUpload className="w-8 h-8 mx-auto mb-2 text-dark-text-secondary" />
                {formData && formData[field] ? (
                    <div>
                        <p className="text-sm mb-1 text-success">✓ File uploaded</p>
                        <p className="text-xs text-dark-text-secondary">{formData[field].name}</p>
                        <input
                            type="file"
                            accept={accept}
                            onChange={(e) => handleFileChange && handleFileChange(e, field)}
                            className="hidden"
                            id={`file-${field}`}
                        />
                        <label htmlFor={`file-${field}`} className="text-xs text-primary hover:underline cursor-pointer mt-2 inline-block">
                            Change file
                        </label>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-dark-text-secondary">PDF, PNG, JPG (max. 5MB)</p>
                        <input
                            type="file"
                            accept={accept}
                            onChange={(e) => handleFileChange && handleFileChange(e, field)}
                            className="hidden"
                            id={`file-${field}`}
                            required={required}
                        />
                        <label htmlFor={`file-${field}`} className="btn-secondary mt-3 cursor-pointer inline-block">
                            Choose File
                        </label>
                    </div>
                )}
            </div>
        </div>
    )
}
