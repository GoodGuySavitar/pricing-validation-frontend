import { useState } from "react";
import ResponseDisplay from "./ResponseDisplay.jsx";

// {
//   "instrumentGuid": "string",
//   "tradeDate": "string",
//   "price": 0.1,
//   "exchange": "string",
//   "productType": "string"
// }

const Choice = () => {
    const [chosen, setChosen] = useState("GET");
    const [id, setId] = useState("");
    const [instrumentGuid, setInstrumentGuid] = useState("");
    const [tradeDate, setTradeDate] = useState("");
    const [price, setPrice] = useState("");
    const [exchange, setExchange] = useState("");
    const [productType, setProductType] = useState("");
    const [response, setResponse] = useState(null);
    const [file, setFile] = useState(null);

    const getColor = () => {
        switch(chosen) {
            case "GET":
            case "GET BY ID":
                return "text-[#5fdd9a]";
            case "POST":
                return "text-[#ffd24b]";
            case "PUT":
                return "text-[#74aef6]";
            case "DELETE":
            case "DELETE BY ID":
                return "text-red-400";
            case "UPLOAD":
                return "text-purple-600";
            default:
                return "text-black";
        }
    };

    const bodyField = () => {
        return (
            <div>
                <label className="block mb-4">
                    <span className="text-gray-800 text-sm font-semibold mb-1 block">Instrument GUID</span>
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter instrument GUID"
                        value={instrumentGuid}
                        onChange={e => setInstrumentGuid(e.target.value)}
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-800 text-sm font-semibold mb-1 block">Trade Date</span>
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter trade date"
                        value={tradeDate}
                        onChange={e => setTradeDate(e.target.value)}
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-800 text-sm font-semibold mb-1 block">Price</span>
                    <input 
                        type="number" 
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.1"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-800 text-sm font-semibold mb-1 block">Exchange</span>
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter exchange"
                        value={exchange}
                        onChange={e => setExchange(e.target.value)}
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-800 text-sm font-semibold mb-1 block">Product Type</span>
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product type"
                        value={productType}
                        onChange={e => setProductType(e.target.value)}
                    />
                </label>
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
                    {/* Upload format examples: show CSV and JSON templates so users know how to structure files */}
                    <div className="mt-4 p-4 bg-white border-l-4 border-blue-500 rounded-md text-sm shadow-sm">
                        <div className="text-gray-900 text-sm font-semibold mb-2">Upload format </div>
                        <div className="mb-3">
                            <div className="text-xs text-gray-600 mb-1">CSV (header row required and fields must match):</div>
                            <pre className="bg-slate-100 text-xs rounded p-3 overflow-x-auto font-mono text-slate-800">{
`instrumentGuid,tradeDate,price,exchange,productType
string, YYYY-MM-DD, number, string, string`
                            }</pre>
                        </div>

                        <div className="mb-2">
                            <div className="text-xs text-gray-600 mb-1">JSON (array of objects):</div>
                            <pre className="bg-slate-100 text-xs rounded p-3 overflow-x-auto font-mono text-slate-800">{
`[
  {"instrumentGuid": "string", "tradeDate": "YYYY-MM-DD", "price": number, "exchange": "string", "productType": "string"}
]` 
                            }</pre>
                        </div>

                        <div className="text-xs text-gray-700">
                            <div>- Use YYYY-MM-DD for dates</div>
                            <div>- `price` must be a numeric value (no $ symbol)</div>
                            <div>- Field names must match exactly the header keys above</div>
                            <div>- CSV must include the header row</div>
                        </div>
                    </div>
                </div>
            );
        }
        
        if (chosen === "GET BY ID" || chosen === "DELETE") {
            return (
                <div className="mt-6 w-full">
                    <label className="block">
                        <span className="text-gray-700 text-sm font-medium mb-1 block">ID</span>
                        <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter ID"
                            value={id}
                            onChange={e => setId(e.target.value)}
                        />
                    </label>
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
                    <label className="block mb-4">
                        <span className="text-gray-700 text-sm font-medium mb-1 block">ID</span>
                        <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter ID"
                            value={id}
                            onChange={e => setId(e.target.value)}
                        />
                    </label>
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
                url = `${baseUrl}/${id}`;
                method = "GET";
                break;
            case "POST":
                url = `${baseUrl}`;
                method = "POST";
                body = JSON.stringify({
                    instrumentGuid: instrumentGuid,
                    tradeDate: tradeDate,
                    price: parseFloat(price),
                    exchange: exchange,
                    productType: productType
                });
                break;
            case "PUT":
                url = `${baseUrl}/${id}`;
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
                url = `${baseUrl}/${id}`;
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
                setResponse({ 
                    message: `Error: ${apiResponse.status} ${apiResponse.statusText}` 
                });
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
                        <button 
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                chosen === "GET" 
                                    ? "bg-black text-[#5fdd9a] shadow-lg scale-105" 
                                    : "bg-black text-[#5fdd9a]/80 hover:text-[#5fdd9a] hover:shadow-md hover:scale-105"
                            }`}
                            onClick={() => setChosen("GET")}
                        >
                            GET
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                chosen === "GET BY ID" 
                                    ? "bg-black text-[#5fdd9a] shadow-lg scale-105" 
                                    : "bg-black text-[#5fdd9a]/80 hover:text-[#5fdd9a] hover:shadow-md hover:scale-105"
                            }`}
                            onClick={() => setChosen("GET BY ID")}
                        >
                            GET BY ID
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                chosen === "POST" 
                                    ? "bg-black text-[#ffd24b] shadow-lg scale-105" 
                                    : "bg-black text-[#ffd24b]/80 hover:text-[#ffd24b] hover:shadow-md hover:scale-105"
                            }`}
                            onClick={() => setChosen("POST")}
                        >
                            POST
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                chosen === "PUT" 
                                    ? "bg-black text-[#74aef6] shadow-lg scale-105" 
                                    : "bg-black text-[#74aef6]/80 hover:text-[#74aef6] hover:shadow-md hover:scale-105"
                            }`}
                            onClick={() => setChosen("PUT")}
                        >
                            PUT
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                chosen === "DELETE" 
                                    ? "bg-black text-red-400 shadow-lg scale-105" 
                                    : "bg-black text-red-400/80 hover:text-red-400 hover:shadow-md hover:scale-105"
                            }`}
                            onClick={() => setChosen("DELETE")}
                        >
                            DELETE
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                chosen === "UPLOAD" 
                                    ? "bg-black text-purple-600 shadow-lg" 
                                    : "bg-black text-purple-600/80 hover:text-purple-600 hover:shadow-md hover:scale-105"
                            }`}
                            onClick={() => setChosen("UPLOAD")}
                        >
                            UPLOAD
                        </button>
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