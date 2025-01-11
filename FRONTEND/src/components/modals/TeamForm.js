import { useState } from 'react';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

export default function TeamForm({ onSubmit, onCancel }) {
  const [teamData, setTeamData] = useState({
    name: '',
    captain: { id: null, name: '', email: '' },
    members: []
  });
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '' });
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData(prev => ({
      ...prev,
      name: value
    }));
  };

  const handleCaptainChange = (e) => {
    const { name, value } = e.target;
    setTeamData(prev => ({
      ...prev,
      captain: {
        ...prev.captain,
        [name]: value,
        // If this is being set by the current user, their ID would come from localStorage
        id: name === 'email' ? localStorage.getItem('userId') : prev.captain.id
      }
    }));
  };

  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMember = () => {
    // Validate that this email isn't already used
    if (newMember.email === teamData.captain.email) {
      setSubmitError('Team captain cannot be added as a member');
      return;
    }

    const isDuplicate = teamData.members.some(member => member.email === newMember.email);
    if (isDuplicate) {
      setSubmitError('This email is already added to the team');
      return;
    }

    if (newMember.name && newMember.email) {
      setTeamData(prev => ({
        ...prev,
        members: [...prev.members, { ...newMember }]
      }));
      setNewMember({ name: '', email: '' });
      setSubmitError('');
    }
  };

  const removeMember = (index) => {
    setTeamData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!teamData.name || !teamData.captain.name || !teamData.captain.email) {
      setSubmitError('Please fill in the team name and captain details');
      return;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(teamData.captain.email)) {
      setSubmitError('Please enter a valid email for the team captain');
      return;
    }

    // Validate member emails
    const invalidMemberEmail = teamData.members.find(member => !emailRegex.test(member.email));
    if (invalidMemberEmail) {
      setSubmitError('Please enter valid email addresses for all team members');
      return;
    }

    onSubmit(teamData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Create New Team</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          ×
        </button>
      </div>

      {submitError && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Team Name"
          id="teamName"
          name="name"
          value={teamData.name}
          onChange={handleChange}
          required
        />

        <div className="space-y-4">
          <h4 className="font-medium">Team Leader (Required)</h4>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Name"
              id="captainName"
              name="name"
              value={teamData.captain.name}
              onChange={handleCaptainChange}
              required
            />
            <InputField
              label="Email"
              type="email"
              id="captainEmail"
              name="email"
              value={teamData.captain.email}
              onChange={handleCaptainChange}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Team Members (Optional)</h4>
            {!showMemberForm && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowMemberForm(true)}
              >
                Add Members
              </Button>
            )}
          </div>

          {showMemberForm && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Name"
                  id="memberName"
                  name="name"
                  value={newMember.name}
                  onChange={handleNewMemberChange}
                />
                <InputField
                  label="Email"
                  type="email"
                  id="memberEmail"
                  name="email"
                  value={newMember.email}
                  onChange={handleNewMemberChange}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowMemberForm(false);
                    setNewMember({ name: '', email: '' });
                  }}
                >
                  Done Adding
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={addMember}
                  disabled={!newMember.name || !newMember.email}
                >
                  Add Member
                </Button>
              </div>
            </>
          )}

          {teamData.members.length > 0 && (
            <div className="mt-4 space-y-2">
              <h5 className="font-medium text-sm text-gray-700">Added Members:</h5>
              {teamData.members.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{member.name}</span>
                    <span className="text-sm text-gray-600 ml-2">{member.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Team
          </Button>
        </div>
      </form>
    </div>
  );
}