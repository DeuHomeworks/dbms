import { useState } from 'react';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

function CreateProjectModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null,
    userEmails: [''],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      logo: file
    }));
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...formData.userEmails];
    newEmails[index] = value;
    setFormData(prev => ({
      ...prev,
      userEmails: newEmails
    }));
  };

  const addEmailField = () => {
    setFormData(prev => ({
      ...prev,
      userEmails: [...prev.userEmails, '']
    }));
  };

  const removeEmailField = (index) => {
    setFormData(prev => ({
      ...prev,
      userEmails: prev.userEmails.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Project Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-600
                  hover:file:bg-primary-100"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Team Members (Email)
              </label>
              {formData.userEmails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="team@example.com"
                  />
                  {formData.userEmails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addEmailField}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                + Add another member
              </button>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
                type="button"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectModal;