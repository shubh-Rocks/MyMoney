import SubscriptionCard from "@/components/dashboard/components/SubscriptionCard";

export default function PricingPage() {
  const subscriptionCardDetails = [
    {
      id: 1,
      title: "Free Trial",
      text: "Best for small vendors starting out",
      money: "₹0",
      button: "Current Plan",
      popular: false,
    },
    {
      id: 2,
      title: "Business Plan",
      text: "Best for growing retail shops",
      money: "₹250",
      button: "Get Started",
      popular: true, // Highlights the best value plan
    },
    {
      id: 3,
      title: "Growth Plan",
      text: "For enterprises scaling fast",
      money: "₹350",
      button: "Get Started",
      popular: false,
    },
  ];

  const features = [
    {
      id: 1,
      feature: "Total borrowers you can add",
      free: "20",
      bussines: "200",
      enterprise: "Unlimited",
    },
    {
      id: 2,
      feature: "Automated WhatsApp Reminders",
      free: "No",
      bussines: "Yes",
      enterprise: "Yes",
    },
    {
      id: 3,
      feature: "AI Sentiment & Risk Scoring",
      free: "Basic",
      bussines: "Advanced",
      enterprise: "Priority AI",
    },
    {
      id: 4,
      feature: "Export data to Excel / PDF",
      free: "No",
      bussines: "Yes",
      enterprise: "Yes",
    },
    {
      id: 5,
      feature: "Customer Support",
      free: "Community",
      bussines: "Priority Support",
      enterprise: "24/7 Dedicated",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-3 lg:px-6">
      <h1 className="text-xl font-bold text-gray-800 tracking-tight sm:text-4xl">
        Choose a plan that's right for your business
      </h1>
      <p className="mt-2 mb-8 text-lg text-gray-600">
        Try out the basic plan risk-free for 30 days. Switch plans or cancel
        anytime with zero hassle.
      </p>

      <div className="text-left max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {subscriptionCardDetails.map((item, index) => (
            <SubscriptionCard
              key={item.id}
              title={item.title}
              text={item.text}
              money={item.money}
              button={item.button}
              isFirstButton={index === 0}
            />
          ))}
        </div>

        {/* Comparison Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xl font-bold text-gray-900">
              Compare Plan Features
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Detailed breakdown of what's included in each tier
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="p-4 sm:pl-8">Features</th>
                  <th className="p-4">Free Trial</th>
                  <th className="p-4 text-[#10B981]">Business Plan</th>
                  <th className="p-4 text-[#3B82F6]">Growth Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {features.map((item, index) => (
                  <tr
                    key={item.id}
                    className="text-gray-700 text-sm sm:text-base hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="p-4 sm:pl-8 font-medium text-gray-900">
                      {item.feature}
                    </td>
                    <td className="p-4 text-gray-600">{item.free}</td>
                    <td className="p-4 font-semibold text-gray-900">
                      {item.bussines}
                    </td>
                    <td className="p-4 font-semibold text-gray-900">
                      {item.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
