import React, { useState, useRef, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Overlay from "./Overlay";

function Form() {
  const initialState = {
    imageInfo: null,
    category: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [responseData, setResponseData] = useState({});

  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData((prevFormData) => ({
        ...prevFormData,
        imageInfo: file,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsOverlayOpen(true);
    setIsLoading(true);

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
      return;
    }

    const convertToBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const imageBase64 = formData.imageInfo
      ? await convertToBase64(formData.imageInfo)
      : null;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const payload = {
          category: formData.category,
          description: formData.description,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          image_base64: imageBase64,
        };

        console.log("Payload:", payload);
        try {
          const response = await fetch("https://snap-report-437019.uc.r.appspot.com/analyze", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log("Successfully submitted:", data);
          setResponseData(data);
          setIsOverlayOpen(true);
        } catch (error) {
          console.error("Failed to submit form:", error);
          setResponseData({ message: "Submission failed. Please try again later." });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error Code = " + error.code + " - " + error.message);
        setIsLoading(false);
      }
    );
  };

  const handleReset = () => {
    setFormData(initialState);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  // Clean up the image preview URL when the component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="rounded-3xl m-5 mx-auto max-w-4xl p-8 bg-zinc-300">
      <form onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="col-span-full">
          <label className="block text-sm font-medium leading-6 text-gray-900 text-left">
            Image
          </label>
          <div className="mt-2 flex justify-center bg-zinc-50 rounded-lg border border-dashed border-zinc-950/100 px-6 py-10">
            <div className="text-center">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs h-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="text-sm relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    Change Image
                  </button>
                </>
              ) : (
                <>
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label className="relative cursor-pointer rounded-md bg-zinc-50 font-semibold text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                      <span>Upload an Image</span>
                      <input
                        ref={fileInputRef}
                        id="imageInfo"
                        name="imageInfo"
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        className="sr-only"
                        capture
                        required
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                </>
              )}
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Dropdown for Category */}
        <div className="mt-4 w-full">
          <label className="block text-sm font-medium leading-6 text-gray-900 text-left">
            Category
          </label>
          <div className="mt-2">
            <select
              id="category"
              name="category"
              autoComplete="country-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-zinc-50"
              onChange={handleChange}
              value={formData.category}
            >
              <option value="" disabled>Select a category</option>
              <option>Injury</option>
              <option>Accident</option>
              <option>Medical Emergency</option>
              <option>Fire</option>
              <option>Theft</option>
              <option>Breaking and Entering</option>
            </select>
          </div>
        </div>

        {/* Description Textarea */}
        <div className="mt-4 col-span-full">
          <label className="block text-sm font-medium leading-6 text-gray-900 text-left">
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-zinc-50"
              onChange={handleChange}
              value={formData.description}
            />
          </div>
        </div>

        {/* Submit and Reset Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row sm:gap-x-4 gap-y-4">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900 bg-zinc-50 border border-gray-300 rounded-md shadow-sm px-4 py-2 w-full transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="submit"
            className="text-sm font-semibold leading-6 text-white bg-sky-900 border border-transparent rounded-md shadow-sm px-4 py-2 w-full transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Overlay for loading and response data */}
      <Overlay 
        open={isOverlayOpen}
        setOpen={setIsOverlayOpen}
        isLoading={isLoading}
        responseData={responseData}
      />
    </div>
  );
}

export default Form;
