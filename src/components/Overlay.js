import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const Overlay = ({ open, setOpen, isLoading, responseData }) => {
    // Parse llama_analysis from responseData
    const llamaAnalysisString = responseData?.llama_analysis;
    let llamaAnalysis = {};

    try {
        llamaAnalysis = llamaAnalysisString
            ? JSON.parse(llamaAnalysisString)
            : {};
    } catch (error) {
        console.error("Failed to parse llama_analysis:", error);
        llamaAnalysis = {};
    }

    const emergencyAnalysis = llamaAnalysis?.recommendations || [];

    console.log("emergencyAnalysis: ", emergencyAnalysis);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setOpen(false)}
            >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center p-12">
                                            <span className="visually-hidden">
                                                Loading analysis...
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-lg leading-6 font-medium text-gray-900">
                                                Emergency Request Sent!
                                            </div>
                                            <div className="mt-2">
                                                <h2 className="text-lg font-bold">
                                                    Recommendations
                                                </h2>
                                                <ul className="list-disc pl-5 text-sm text-gray-500">
                                                    {emergencyAnalysis.map(
                                                        (
                                                            recommendation,
                                                            index
                                                        ) => (
                                                            <li
                                                                key={index}
                                                                className="mb-2"
                                                            >
                                                                {recommendation}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setOpen(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default Overlay;
