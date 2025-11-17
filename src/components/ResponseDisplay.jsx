// Helper components defined within this file
const StatCard = ({ label, value, variant = "default" }) => {
    const variants = {
        default: { bg: "bg-gray-50", border: "border-gray-200", labelColor: "text-gray-500", valueColor: "text-gray-900" },
        success: { bg: "bg-green-50", border: "border-green-200", labelColor: "text-green-600", valueColor: "text-green-700" },
        error: { bg: "bg-red-50", border: "border-red-200", labelColor: "text-red-600", valueColor: "text-red-700" }
    };
    const v = variants[variant];
    
    return (
        <div className={`${v.bg} p-3 rounded-md border ${v.border}`}>
            <div className={`text-xs ${v.labelColor} mb-1`}>{label}</div>
            <div className={`text-lg font-semibold ${v.valueColor}`}>{value}</div>
        </div>
    );
};

const ResponseDisplay = ({ response }) => {
    if (!response) {
        return null;
    }

    if (response.summary && response.preview) {
        return (
            <div className="mt-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Import Results</h2>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-md">{response.format}</span>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Summary</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <StatCard label="Total Rows" value={response.summary.total} variant="default" />
                            <StatCard label="Valid" value={response.summary.valid} variant="success" />
                            <StatCard label="Invalid" value={response.summary.invalid} variant="error" />
                            <StatCard label="Missing Values" value={response.summary.missingValues} variant="default" />
                            <StatCard label="Saved" value={response.saved} variant="success" />
                            <StatCard label="Skipped" value={response.skippedDuplicates} variant="default" />
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Preview ({response.preview.length} rows)</h3>
                        <div className="max-h-80 overflow-y-auto space-y-2">
                            {response.preview.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-600 font-medium">GUID:</span>
                                            <span className="ml-2 text-gray-900 font-medium">{item.instrumentGuid}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 font-medium">Date:</span>
                                            <span className="ml-2 text-gray-900 font-medium">{item.tradeDate}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 font-medium">Price:</span>
                                            <span className="ml-2 text-gray-900 font-medium">{item.price !== null ? `$${item.price}` : 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 font-medium">Exchange:</span>
                                            <span className="ml-2 text-gray-900 font-medium">{item.exchange}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-600 font-medium">Type:</span>
                                            <span className="ml-2 text-gray-900 font-medium">{item.productType}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {response.issues && response.issues.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-red-700 mb-3">Issues ({response.issues.length})</h3>
                            <div className="space-y-2">
                                {response.issues.map((issue, index) => (
                                    <div key={index} className="bg-red-50 p-3 rounded-md border border-red-200 text-sm">
                                        <span className="font-medium text-red-900">Row {issue.rowNumber}:</span>
                                        <span className="text-red-700 ml-1">{issue.message}</span>
                                        <span className="text-red-600 ml-1">({issue.type})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {response.warnings && response.warnings.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-yellow-700 mb-3">Warnings ({response.warnings.length})</h3>
                            <div className="space-y-2">
                                {response.warnings.map((warning, index) => (
                                    <div key={index} className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-sm">
                                        <span className="font-medium text-yellow-900">Row {warning.rowNumber}:</span>
                                        <span className="text-yellow-700 ml-1">{warning.message}</span>
                                        <span className="text-yellow-600 ml-1">({warning.code})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (Array.isArray(response)) {
        return (
            <div className="mt-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">All Records</h2>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-md">{response.length} items</span>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-3">
                        {response.map((item) => (
                            <div key={item.id} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                <div className="mb-3">
                                    <span className="text-sm font-medium text-gray-500">ID: <span className="text-gray-900">{item.id}</span></span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <div className="text-gray-600 mb-1 font-medium">Instrument GUID</div>
                                        <div className="text-gray-900 font-medium break-all">{item.instrumentGuid}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600 mb-1 font-medium">Trade Date</div>
                                        <div className="text-gray-900 font-medium">{item.tradeDate}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600 mb-1 font-medium">Price</div>
                                        <div className="text-gray-900 font-semibold text-base">${item.price}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600 mb-1 font-medium">Exchange</div>
                                        <div className="text-gray-900 font-medium">{item.exchange}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-gray-600 mb-1 font-medium">Product Type</div>
                                        <div className="text-gray-900 font-medium">{item.productType}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Response</h2>
                
                <div className="space-y-3">
                    {response.id && (
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-32 font-medium">ID</span>
                            <span className="text-gray-900 font-medium">{response.id}</span>
                        </div>
                    )}
                    {response.instrumentGuid && (
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-32 font-medium">Instrument GUID</span>
                            <span className="text-gray-900 font-medium break-all">{response.instrumentGuid}</span>
                        </div>
                    )}
                    {response.tradeDate && (
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-32 font-medium">Trade Date</span>
                            <span className="text-gray-900 font-medium">{response.tradeDate}</span>
                        </div>
                    )}
                    {response.price !== undefined && (
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-32 font-medium">Price</span>
                            <span className="text-gray-900 font-semibold text-lg">${response.price}</span>
                        </div>
                    )}
                    {response.exchange && (
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-32 font-medium">Exchange</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">{response.exchange}</span>
                        </div>
                    )}
                    {response.productType && (
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-32 font-medium">Product Type</span>
                            <span className="text-gray-900 font-medium">{response.productType}</span>
                        </div>
                    )}
                    {response.message && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <span className="text-sm text-blue-800">{response.message}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResponseDisplay;
