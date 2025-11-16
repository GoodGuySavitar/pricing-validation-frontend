import { useState } from "react";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileType = selectedFile.name.split('.').pop().toLowerCase();
            if (fileType === 'csv' || fileType === 'json') {
                setFile(selectedFile);
                setResponse(null);
            } else {
                alert('Please select a CSV or JSON file');
                e.target.value = null;
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const apiResponse = await fetch('https://pricing-validation.onrender.com/api/import', {
                method: 'POST',
                body: formData,
            });

            const contentType = apiResponse.headers.get("content-type");
            if (apiResponse.ok && contentType && contentType.includes("application/json")) {
                const result = await apiResponse.json();
                setResponse(result);
            } else if (apiResponse.ok) {
                setResponse({ message: 'File uploaded successfully but no response data' });
            } else {
                setResponse({ message: `Error: ${apiResponse.status} ${apiResponse.statusText}` });
            }
        } catch (error) {
            setResponse({ message: "Error: " + error.message });
        } finally {
            setUploading(false);
        }
    };

    const renderPreview = () => {
        if (!response || !response.preview) return null;

        return (
            <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Preview ({response.format})</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                    {response.preview.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded border border-gray-300 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <div><span className="font-semibold">Instrument GUID:</span> {item.instrumentGuid}</div>
                                <div><span className="font-semibold">Trade Date:</span> {item.tradeDate}</div>
                                <div><span className="font-semibold">Price:</span> {item.price !== null ? `$${item.price}` : 'N/A'}</div>
                                <div><span className="font-semibold">Exchange:</span> {item.exchange}</div>
                                <div className="col-span-2"><span className="font-semibold">Product Type:</span> {item.productType}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSummary = () => {
        if (!response || !response.summary) return null;

        const { summary } = response;
        return (
            <div className="mt-6 bg-blue-50 p-4 rounded border border-blue-300">
                <h3 className="text-lg font-bold mb-3">Summary</h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                    <div><span className="font-semibold">Total Rows:</span> {summary.total}</div>
                    <div><span className="font-semibold text-green-600">Valid:</span> {summary.valid}</div>
                    <div><span className="font-semibold text-red-600">Invalid:</span> {summary.invalid}</div>
                    <div><span className="font-semibold">Missing Values:</span> {summary.missingValues}</div>
                    <div><span className="font-semibold">Invalid Dates:</span> {summary.invalidDates}</div>
                    <div><span className="font-semibold">Duplicates:</span> {summary.duplicateRecords}</div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="font-semibold text-green-700">Saved: {response.saved}</div>
                    <div className="font-semibold text-yellow-700">Skipped Duplicates: {response.skippedDuplicates}</div>
                </div>
            </div>
        );
    };

    const renderIssues = () => {
        if (!response || !response.issues || response.issues.length === 0) return null;

        return (
            <div className="mt-6 bg-red-50 p-4 rounded border border-red-300">
                <h3 className="text-lg font-bold mb-3 text-red-700">Issues</h3>
                <div className="space-y-2 text-sm">
                    {response.issues.map((issue, index) => (
                        <div key={index} className="bg-white p-2 rounded border border-red-200">
                            <span className="font-semibold">Row {issue.rowNumber}:</span> {issue.message} ({issue.type})
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderWarnings = () => {
        if (!response || !response.warnings || response.warnings.length === 0) return null;

        return (
            <div className="mt-6 bg-yellow-50 p-4 rounded border border-yellow-300">
                <h3 className="text-lg font-bold mb-3 text-yellow-700">Warnings</h3>
                <div className="space-y-2 text-sm">
                    {response.warnings.map((warning, index) => (
                        <div key={index} className="bg-white p-2 rounded border border-yellow-200">
                            <span className="font-semibold">Row {warning.rowNumber}:</span> {warning.message} ({warning.code})
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex justify-center pt-10">
            <div className="flex flex-col items-center w-2/3">
                <div className="bg-[#212121] text-white font-bold py-2 px-6 rounded text-2xl mb-5">
                    Import CSV/JSON File
                </div>

                <div className="w-full bg-white p-6 rounded border border-gray-300 shadow-sm">
                    <div className="mb-4">
                        <label className="block text-black font-semibold mb-2">
                            Select File (CSV or JSON):
                        </label>
                        <input
                            type="file"
                            accept=".csv,.json"
                            onChange={handleFileChange}
                            className="w-full p-2 rounded border border-gray-300"
                        />
                    </div>

                    {file && (
                        <div className="mb-4 text-sm text-gray-600">
                            Selected: <span className="font-semibold">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="bg-[#212121] text-white font-bold py-2 px-6 rounded hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Uploading...' : 'Upload & Import'}
                    </button>
                </div>

                {response && (
                    <div className="w-full mt-6">
                        {response.message && !response.preview && (
                            <div className="bg-gray-100 p-4 rounded border border-gray-300">
                                <p className="font-semibold">{response.message}</p>
                            </div>
                        )}
                        {renderSummary()}
                        {renderPreview()}
                        {renderIssues()}
                        {renderWarnings()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
