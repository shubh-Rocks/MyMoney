import SubscriptionCard from "@/components/dashboard/components/SubscriptionCard";

export default function () {
  const subscriptionCardDetails = [
    {
      id: 1,
      title: "Free trial",
      text: "Best for small vendors",
      money: "₹0",
      button: "Your current plan",
    },

    {
      id: 2,
      title: "Bussiness plan",
      text: "Best for bussiness",
      money: "₹250",
      button: "Get Started",
    },

    {
      id: 3,
      title: "Growth plan",
      text: "Best for growing bussiness",
      money: "₹350",
      button: "Get Started",
    },
  ];
  return (
    <div className="p-5">
      <h1 className="text-4xl font-semibold mt-2 mb-2">
        Choose a plan that's right for you
      </h1>
      <span className="text-xl text-gray-500 ">
        Try out basic plan risk free for 30 days,Switch plans or cancel any time
      </span>

      <div className="flex justify-evenly mt-12">
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
      <div className="bg-white"></div>
    </div>
  );
}
