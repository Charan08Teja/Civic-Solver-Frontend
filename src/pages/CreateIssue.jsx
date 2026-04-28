import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Upload, MapPin, FileText, Check, X, Camera } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";

function CreateIssue() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    latitude: "",
    longitude: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { value: "POTHOLE", label: "Pothole" },
    { value: "GARBAGE", label: "Garbage" },
    { value: "WATER_LEAKAGE", label: "Water Leakage" },
    { value: "STREETLIGHT", label: "Streetlight" },
    { value: "ROAD_DAMAGE", label: "Road Damage" },
    { value: "OTHER", label: "Other" },
  ];

  const steps = [
    { id: 1, title: "Issue Details", icon: FileText },
    { id: 2, title: "Location", icon: MapPin },
    { id: 3, title: "Photo", icon: Camera },
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      toast.loading("Getting your location...", { id: "location" });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateFormData("latitude", position.coords.latitude.toString());
          updateFormData("longitude", position.coords.longitude.toString());
          toast.success("Location obtained!", { id: "location" });
        },
        () => {
          toast.error("Location access denied. Please enter coordinates manually.", { id: "location" });
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }
      updateFormData("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      updateFormData("image", file);
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error("Please upload an image file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.title.trim() && formData.description.trim() && formData.category;
      case 2:
        return formData.latitude && formData.longitude;
      case 3:
        return true; // Photo is optional
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const submitToast = toast.loading("Creating issue...");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("latitude", formData.latitude);
      formDataToSend.append("longitude", formData.longitude);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      await API.post("/issues", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Issue created successfully!", { id: submitToast });
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create issue", { id: submitToast });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Issue Title *
              </label>
              <Input
                type="text"
                placeholder="Brief title of the issue"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    type="button"
                    variant={formData.category === cat.value ? "default" : "outline"}
                    onClick={() => updateFormData("category", cat.value)}
                    className="justify-start"
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <Textarea
                placeholder="Detailed description of the issue"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                rows={4}
                className="w-full"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Set Issue Location
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Help others find this issue by providing accurate location coordinates.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={getLocation}
                className="w-full"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Get Current Location
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Latitude *
                  </label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="e.g. 40.7128"
                    value={formData.latitude}
                    onChange={(e) => updateFormData("latitude", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Longitude *
                  </label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="e.g. -74.0060"
                    value={formData.longitude}
                    onChange={(e) => updateFormData("longitude", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Camera className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Add a Photo (Optional)
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Visual evidence helps authorities understand and resolve issues faster.
              </p>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragOver
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {preview ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="preview"
                      className="mx-auto h-48 w-48 object-cover rounded-lg shadow-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                      onClick={() => {
                        updateFormData("image", null);
                        setPreview(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Image uploaded successfully!
                  </p>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                        Click to upload
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400"> or drag and drop</span>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Report a Civic Issue
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Help improve your community by reporting problems
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-300'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <step.icon className="h-5 w-5" />
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">
              {steps.find(s => s.id === currentStep)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center"
                >
                  {loading ? (
                    "Creating..."
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Create Issue
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreateIssue;