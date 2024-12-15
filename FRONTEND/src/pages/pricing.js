import { plans } from '../utils/plans';
import Card from '../components/ui/Card';

function PricingCard({ name, price, period, description, features }) {
  return (
    <Card className="text-center">
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="mt-2 text-2xl font-bold">{price}</p>
      {period && <p className="text-sm text-gray-500">{period}</p>}
      <p className="mt-4 text-gray-600">{description}</p>
      <ul className="mt-4 text-left">
        {features.map((feature, index) => (
          <li key={index} className="mt-2 text-gray-600">
            {feature}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Pricing() {
  return (
    <div className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">
            Our Pricing Plans
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose the plan that suits your needs
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
