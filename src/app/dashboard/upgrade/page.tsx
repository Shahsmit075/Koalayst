"use client";

import { useEffect } from "react";
import { FaCheckCircle, FaTrophy, FaRocket, FaStar, FaDiscord } from "react-icons/fa";

const SubscriptionPlans = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      icon: FaDiscord,
      iconColor: "text-blue-500",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      features: [
        "Up to 100 events per month",
        "3 event categories",
        "Basic notifications",
        "Community support",
      ],
    },
    {
      name: "Pro",
      price: "$29",
      description: "Best for growing teams",
      icon: FaStar,
      iconColor: "text-blue-800",
      buttonColor: "bg-blue-800 hover:bg-blue-900",
      features: [
        "Up to 1000 events per month",
        "10 event categories",
        "Advanced insights",
        "Priority Discord integration",
        "24/7 email support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      icon: FaTrophy,
      iconColor: "text-green-500",
      buttonColor: "bg-green-500 hover:bg-green-600",
      features: [
        "Unlimited events",
        "Custom categories",
        "Dedicated account manager",
        "Custom integrations",
        "Priority phone support",
        "SLA guarantees",
      ],
    },
  ];

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
    }}>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 via-teal-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-semibold font-heading text-teal-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-teal-700">
              Select the perfect plan for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2 bg-white shadow-lg"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-3xl font-semibold font-heading text-teal-900">
                        {plan.name}
                      </h3>
                      <p className="text-teal-600">{plan.description}</p>
                    </div>
                    <plan.icon className={`text-2xl ${plan.iconColor}`} />
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-teal-900">
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-teal-600">/month</span>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <FaCheckCircle className="text-teal-500 mr-2" />
                        <span className="text-teal-800">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-6 rounded-md transition-colors duration-200 ${plan.buttonColor} text-white font-semibold`}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;