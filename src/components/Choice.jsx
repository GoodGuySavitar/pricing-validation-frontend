import { useState } from "react";
import ResponseDisplay from "./ResponseDisplay.jsx";

const LabeledInput = ({ label, type = "text", value, onChange, placeholder = "", step }) => (
    <label className="block mb-4">
        <span className="text-gray-800 text-sm font-semibold mb-1 block">{label}</span>
        <input 
            type={type}
            step={step}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </label>
);

const MethodButton = ({ label, isActive, colorClass, onClick }) => (
    <button 
        className={`px-4 py-2 rounded-lg font-bold transition-all bg-black ${colorClass} ${
            isActive 
                ? "shadow-lg scale-105" 
                : "opacity-80 hover:opacity-100 hover:shadow-md hover:scale-105"
        }`}
        onClick={onClick}
    >
        {label}
    </button>
);

const UploadFormatNotes = () => (
    <div className="mt-4 p-4 bg-white border-l-4 border-blue-500 rounded-md text-sm shadow-sm">
        <div className="text-gray-900 text-sm font-semibold mb-2">Upload format</div>
        <div className="mb-3">
            <div className="text-xs text-gray-600 mb-1">CSV (header row required and fields must match):</div>
            <pre className="bg-slate-100 text-xs rounded p-3 overflow-x-auto font-mono text-slate-800">
{`instrumentGuid,tradeDate,price,exchange,productType
string, YYYY-MM-DD, number, string, string`}
            </pre>
        </div>
        <div className="mb-2">
            <div className="text-xs text-gray-600 mb-1">JSON (array of objects):</div>
            <pre className="bg-slate-100 text-xs rounded p-3 overflow-x-auto font-mono text-slate-800">
{`[
{"instrumentGuid": "string", "tradeDate": "YYYY-MM-DD", "price": number, "exchange": "string", "productType": "string"}
]`}
            </pre>
        </div>
        <div className="text-xs text-gray-700">
            <div>- Use YYYY-MM-DD for dates</div>
            <div>- `price` must be a numeric value (no $ symbol)</div>
            <div>- Field names must match exactly the header keys above</div>
            <div>- CSV must include the header row</div>
        </div>
    </div>
);

const Choice = () => {
    const [chosen, setChosen] = useState("GET");
    const [instrumentGuid, setInstrumentGuid] = useState("");
    const [currentInstrumentGuid, setCurrentInstrumentGuid] = useState("");
    const [tradeDate, setTradeDate] = useState("");
    const [price, setPrice] = useState("");
    const [exchange, setExchange] = useState("");
    const [productType, setProductType] = useState("");
    const [response, setResponse] = useState(null);
    const [file, setFile] = useState(null);

    const bodyField = () => {
        return (
            <div>
                <LabeledInput 
                    label="Instrument GUID"
                    value={instrumentGuid}
                    onChange={e => setInstrumentGuid(e.target.value)}
                    placeholder={chosen === "PUT" ? "Enter new instrument GUID" : "Enter instrument GUID"}
                />
                <LabeledInput 
                    label="Trade Date"
                    value={tradeDate}
                    onChange={e => setTradeDate(e.target.value)}
                    placeholder="Enter trade date"
                />
                <LabeledInput 
                    label="Price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="0.1"
                />
                <LabeledInput 
                    label="Exchange"
                    value={exchange}
                    onChange={e => setExchange(e.target.value)}
                    placeholder="Enter exchange"
                />
                <LabeledInput 
                    label="Product Type"
                    value={productType}
                    onChange={e => setProductType(e.target.value)}
                    placeholder="Enter product type"
                />
            </div>
        );
    };

    const requestBody = () => {
        if (chosen === "UPLOAD") {
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

            return (
                <div className="mt-6 w-full">
                    <label className="block">
                        <span className="text-gray-700 text-sm font-medium mb-2 block">Upload File</span>
                        <input 
                            type="file"
                            accept=".csv,.json"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={handleFileChange}
                        />
                    </label>
                    {file && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Selected file:</span> {file.name}
                            </p>
                        </div>
                    )}
                    <UploadFormatNotes />
                </div>
            );
        }
        
        if (chosen === "GET BY ID" || chosen === "DELETE") {
            return (
                <div className="mt-6 w-full">
                    <LabeledInput 
                        label="Instrument GUID"
                        value={instrumentGuid}
                        onChange={e => setInstrumentGuid(e.target.value)}
                        placeholder="Enter instrument GUID"
                    />
                </div>
            );
        }
        if (chosen === "POST") {
            return (
                <div className="mt-6 w-full">
                    {bodyField()}
                </div>
            );
        }
        if (chosen === "PUT") {
            return (
                <div className="mt-6 w-full">
                    <LabeledInput 
                        label="Current Instrument GUID (to update)"
                        value={currentInstrumentGuid}
                        onChange={e => setCurrentInstrumentGuid(e.target.value)}
                        placeholder="Enter current instrument GUID"
                    />
                    {bodyField()}
                </div>
            );
        }
        return null;
    };

    const handleSendRequest = async () => {
        if (chosen === "UPLOAD") {
            if (!file) {
                alert('Please select a file first');
                return;
            }

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
            }
            return;
        }

        const baseUrl = "https://pricing-validation.onrender.com/api/pricing";
        let url = baseUrl;
        let method = "GET";
        let body = null;
        switch (chosen) {
            case "GET":
                url = baseUrl;
                method = "GET";
                break;
            case "GET BY ID":
                if (!instrumentGuid) {
                    alert('Please provide an instrument GUID');
                    return;
                }
                url = `${baseUrl}/${encodeURIComponent(instrumentGuid)}`;
                method = "GET";
                break;
            case "POST":
                url = `${baseUrl}`;
                method = "POST";
                if (!instrumentGuid) {
                    alert('Please provide an instrument GUID');
                    return;
                }
                body = JSON.stringify({
                    instrumentGuid: instrumentGuid,
                    tradeDate: tradeDate,
                    price: parseFloat(price),
                    exchange: exchange,
                    productType: productType
                });
                break;
            case "PUT":
                if (!currentInstrumentGuid) {
                    alert('Please provide the current instrument GUID');
                    return;
                }
                if (!instrumentGuid) {
                    alert('Please provide the instrument GUID for the updated object');
                    return;
                }
                url = `${baseUrl}/${encodeURIComponent(currentInstrumentGuid)}`;
                method = "PUT";
                body = JSON.stringify({
                    instrumentGuid: instrumentGuid,
                    tradeDate: tradeDate,
                    price: parseFloat(price),
                    exchange: exchange,
                    productType: productType
                });
                break;
            case "DELETE":
                if (!instrumentGuid) {
                    alert('Please provide an instrument GUID');
                    return;
                }
                url = `${baseUrl}/${encodeURIComponent(instrumentGuid)}`;
                method = "DELETE";
                break;
            default:
                return;
        }
        try {
            const apiResponse = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: ["GET"].includes(method) ? null : body,
            });

            const contentType = apiResponse.headers.get("content-type");
            if (apiResponse.ok && contentType && contentType.includes("application/json")) {
                const result = await apiResponse.json();
                setResponse(result);
            } else if (apiResponse.ok) {
                setResponse({ 
                    message: `${chosen} request completed successfully!`,
                    status: apiResponse.status 
                });
            } else {
                if (apiResponse.status === 409 && (chosen === "POST" || chosen === "PUT")) {
                    setResponse({
                        message: chosen === "POST"
                            ? "instrumentGuid already exists! Enter a unique instrumentGuid."
                            : "The new instrumentGuid already exists! Enter a unique instrumentGuid.",
                        status: apiResponse.status
                    });
                } else {
                    setResponse({ 
                        message: `Error: ${apiResponse.status} ${apiResponse.statusText}` 
                    });
                }
            }
        } catch (error) {
            setResponse({ message: "Error: " + error.message });
        }
    };

    return (
    <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Pricing Validation</h1>
                
                <div className="mb-6">
                    <label className="text-gray-800 text-lg font-semibold mb-2 block">Select An Action</label>
                    <div className="grid grid-cols-3 gap-3">
                        <MethodButton 
                            label="GET"
                            isActive={chosen === "GET"}
                            colorClass="text-[#5fdd9a]"
                            onClick={() => setChosen("GET")}
                        />
                        <MethodButton 
                            label="GET BY ID"
                            isActive={chosen === "GET BY ID"}
                            colorClass="text-[#5fdd9a]"
                            onClick={() => setChosen("GET BY ID")}
                        />
                        <MethodButton 
                            label="POST"
                            isActive={chosen === "POST"}
                            colorClass="text-[#ffd24b]"
                            onClick={() => setChosen("POST")}
                        />
                        <MethodButton 
                            label="PUT"
                            isActive={chosen === "PUT"}
                            colorClass="text-[#74aef6]"
                            onClick={() => setChosen("PUT")}
                        />
                        <MethodButton 
                            label="DELETE"
                            isActive={chosen === "DELETE"}
                            colorClass="text-red-400"
                            onClick={() => setChosen("DELETE")}
                        />
                        <MethodButton 
                            label="UPLOAD"
                            isActive={chosen === "UPLOAD"}
                            colorClass="text-purple-600"
                            onClick={() => setChosen("UPLOAD")}
                        />
                    </div>
                </div>

                {requestBody()}

                <button 
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    onClick={handleSendRequest}
                >
                    Send {chosen} Request
                </button>
            </div>
            
            <ResponseDisplay response={response} />
        </div>
    </div>
    )
}

export default Choice