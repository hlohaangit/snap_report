import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Admin() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading indicator
      try {
        const response = await fetch(
          "https://snap-report-437019.uc.r.appspot.com/getalldata"
        );
        const jsonData = await response.json();
        setData(jsonData.data);
        console.log(jsonData.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // End loading indicator
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col max-w-4xl mx-auto overflow-hidden shadow-md my-5">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
              role="status"
            >
              <span className="visually-hidden"></span>
            </div>
          </div>
        ) : (
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-zinc-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th
                        scope="col"
                        className="w-1/7 whitespace-normal px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Severity
                      </th>
                      <th
                        scope="col"
                        className="w-2/7 whitespace-normal px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Emergency
                      </th>
                      <th
                        scope="col"
                        className="w-1/7 whitespace-normal px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Responders
                      </th>
                      <th
                        scope="col"
                        className="w-1/7 whitespace-normal px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="w-1/7 whitespace-normal px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Confidence
                      </th>
                      <th
                        scope="col"
                        className="w-1/7 whitespace-normal px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date and Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
  {data.slice().reverse().map((item, index) => {
    let imageAnalysis = {};
    let llamaAnalysis = {};

    try {
      imageAnalysis = JSON.parse(item.image_analysis);
    } catch (e) {
      console.error('Error parsing image_analysis JSON:', e);
    }

    try {
      llamaAnalysis = JSON.parse(item.llama_analysis);
    } catch (e) {
      console.error('Error parsing llama_analysis JSON:', e);
    }

    return (
      <tr key={index} className="hover:bg-zinc-100">
        <td className="px-6 py-4 whitespace-normal text-sm text-gray-800">
          {imageAnalysis.severity || 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-normal text-sm text-gray-800">
          {llamaAnalysis.analysis || 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-normal text-sm text-gray-800">
          {Array.isArray(imageAnalysis.first_responders) && imageAnalysis.first_responders.length > 0 ? (
            imageAnalysis.first_responders.map((responder, responderIndex) => (
              <div key={responderIndex}>{responder}</div>
            ))
          ) : (
            "No responders"
          )}
        </td>
        <td className="px-6 py-4 whitespace-normal text-sm text-gray-800">
          {item.location || "Location not provided"}
        </td>
        <td className="px-6 py-4 whitespace-normal text-sm text-gray-800">
          {imageAnalysis.confidence !== undefined ? `${imageAnalysis.confidence}%` : "Not an emergency"}
        </td>
        <td className="px-6 py-4 whitespace-normal text-sm text-gray-800">
          {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
        </td>
      </tr>
    );
  })}
</tbody>

                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Admin;