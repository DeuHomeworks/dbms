import { useState } from 'react';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import TeamForm from './TeamForm';
import { jwtDecode } from 'jwt-decode';

export default function CreateProjectModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null,
    teams: [],
  });
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const decoded =  jwtDecode(token);
      return decoded.UID; // Make sure this matches the property name you used in jwt.sign
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };



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

  const handleTeamSubmit = (team) => {
    setFormData(prev => ({
      ...prev,
      teams: [...prev.teams, team]
    }));
    setShowTeamForm(false);
  };

  const handleRemoveTeam = (teamIndex) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams.filter((_, index) => index !== teamIndex)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.name.trim()) {
      setSubmitError('Project name is required');
      return;
    }

    if (formData.teams.length === 0) {
      setSubmitError('Please add at least one team to the project');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const requestData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        teams: formData.teams
      };

      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken();
      if (!token ) {
        setSubmitError(`Authentication required. Please log in again. token: ${token} userId: ${userId}`);
        setIsSubmitting(false);
        return;
      }
      console.log('token:', token);
      console.log('userId:', userId);

      console.log('Sending request with:', {
        requestData,
        token,
        userId,
        teams: formData.teams // Log teams specifically
      });


      const response = await fetch('http://localhost:5000/projects/createProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'User-ID': userId},
        body: JSON.stringify(requestData)
      });

      console.log('reqData:', requestData);
      // // Handle logo upload separately if exists
      // if (formData.logo) {
      //   const logoData = new FormData();
      //   logoData.append('logo', formData.logo);
        
      //   await fetch('http://localhost:3000/api/uploadProjectLogo', {
      //     method: 'POST',
      //     headers: {
      //       'Authorization': `Bearer ${token}`,
      //       'user-id': userId
      //     },
      //     body: logoData
      //   });
      // }

      if (!response.ok) {
        console.log('response:', response);
        const errorData = await response.json().catch(() => ({
          message: `Server error: ${response.status} ${response.statusText}`
        }));
        console.log('Error response:', errorData);  // Add this line
        throw new Error(errorData.message || 'Failed to create project');
      }

      const result = await response.json();
      console.log('Project created successfully:', result);
      
      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        logo: null,
        teams: []
      });
      onClose();

    } catch (error) {
      console.error('Error creating project:', error);
      setSubmitError(error.message || 'Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          {showTeamForm ? (
            <TeamForm onSubmit={handleTeamSubmit} onCancel={() => setShowTeamForm(false)} />
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
              
              {submitError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {submitError}
                </div>
              )}

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
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Teams
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowTeamForm(true)}
                    >
                      Add Team
                    </Button>
                  </div>
                  
                  {formData.teams.length > 0 ? (
                    <div className="space-y-2">
                      {formData.teams.map((team, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{team.name}</h4>
                            <p className="text-sm text-gray-600">
                              Captain: {team.captain.name} • {team.members.length} members
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTeam(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No teams added yet. Click "Add Team" to create your first team.
                    </p>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    type="button"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || formData.teams.length === 0}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Project'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}