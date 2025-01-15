import {Link, useNavigate} from 'react-router-dom';
import {useEffect} from "react";
import {fetchUserDetails} from "../utils/userUtils";
import {jwtDecode} from "jwt-decode";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode the token to extract the user ID
      const decoded = jwtDecode(token); // Decode JWT to extract user info
      const userId = decoded.UID; // Get the user ID from the decoded token

      // Fetch user details (if needed for your logic)
      fetchUserDetails(token).then((userData) => {
        if (userData) {
         // navigate("/projects/");
        }
      });
    }
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Streamline Your Workflow, Empower Your Team
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Transform the way your team works with our intuitive project management solution.
            Boost productivity, enhance collaboration, and achieve your goals faster.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/signup" className="btn-primary">
              Get Started
            </Link>
            <Link to="/features" className="btn-secondary">
              Learn More
            </Link>
            <Link to="/pricing" className="btn-secondary">
              Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Why Choose TaskFlow?
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your projects
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  Task Management
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Organize and track tasks efficiently with our intuitive interface.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  Team Collaboration
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Work together seamlessly with real-time updates and communication.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  Progress Tracking
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Monitor project progress with detailed analytics and reports.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;