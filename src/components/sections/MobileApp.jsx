import React from "react";

const MobileApp = () => {
  const contacts = [
    {
      id: 1,
      initials: "RK",
      name: "Sharma Hardware",
      status: "₹4,500",
      avatarBg: "bg-[#1b6b83]",
      badgeStyles: "bg-[#faeed6] text-[#b88222]",
    },
    {
      id: 2,
      initials: "SV",
      name: "Suresh Verma",
      status: "Paid Up",
      avatarBg: "bg-[#229754]",
      badgeStyles: "bg-[#e4f5e9] text-[#006f4e]",
    },
    {
      id: 3,
      initials: "MT",
      name: "Manoj Traders",
      status: "₹12,000",
      avatarBg: "bg-[#b67e1a]",
      badgeStyles: "bg-[#faeed6] text-[#b88222]",
    },
  ];

  return (
    <section className="mt-16 md:mt-24 lg:mt-30 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="w-full max-w-[300px] h-[520px] rounded-[3rem] border-[10px] border-slate-900 bg-slate-50 shadow-2xl relative flex flex-col justify-between overflow-hidden shrink-0">
        <div className="bg-white pt-3 pb-2 px-4 border-b border-gray-100">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-3">
            <span>9:47</span>
            <span>5G ●●●</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="text-xs text-gray-400 font-medium">
              Total to collect
            </span>
            <span className="font-extrabold text-2xl text-slate-800">
              ₹ 84,302
            </span>
          </div>

          <div className="flex items-center justify-between gap-1 text-xs">
            <div className="bg-[#26A257] px-3 py-1 rounded-xl text-white font-medium">
              All
            </div>
            <div className="bg-white border px-3 py-1 border-gray-300 rounded-xl text-slate-600 font-medium">
              Paid
            </div>
            <div className="bg-white border border-gray-300 rounded-xl px-3 py-1 text-slate-600 font-medium">
              Due
            </div>
          </div>
        </div>

        <div className="bg-white flex-1 p-4 relative font-sans overflow-y-auto">
          {contacts.map((contact) => (
            <React.Fragment key={contact.id}>
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${contact.avatarBg}`}
                  >
                    {contact.initials}
                  </div>

                  <h2 className="text-[#072a33] font-semibold text-xs sm:text-sm">
                    {contact.name}
                  </h2>
                </div>

                <div
                  className={`px-3 py-1 rounded-full font-bold text-[10px] sm:text-xs ${contact.badgeStyles}`}
                >
                  {contact.status}
                </div>
              </div>

              <hr className="border-t border-[#e8e4d9]/60" />
            </React.Fragment>
          ))}

          <button
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#279f5c] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(39,159,92,0.4)] hover:bg-[#1f874d] transition-colors"
            aria-label="Add new"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="w-full lg:max-w-xl text-center lg:text-left leading-relaxed">
        <span className="font-bold text-xs sm:text-sm tracking-widest text-[#229754] uppercase bg-[#e4f5e9] px-3 py-1 rounded-full">
          MOBILE APP
        </span>

        <h2 className="text-slate-900 font-extrabold text-2xl sm:text-3xl md:text-4xl mt-4 mb-3 tracking-tight">
          Your business, always with you.
        </h2>

        <p className="text-gray-600 text-sm sm:text-base mb-6">
          Whether you're at your shop or at home, your records are always within
          reach. Manage everything on the go—even without an internet
          connection.
        </p>

        {/* Feature 1 */}
        <div className="mb-4">
          <h3 className="font-bold text-lg text-slate-800 mb-1">
            Offline Mode
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">
            No internet? No problem. Record transactions anytime. Your data
            automatically syncs once you're back online.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="mb-4">
          <h4 className="font-bold text-lg text-slate-800 mb-1">
            Smart Reminders
          </h4>
          <p className="text-gray-500 text-sm sm:text-base">
            Automatically send friendly WhatsApp payment reminders to customers
            before their due dates—no manual follow-up needed.
          </p>
        </div>

        {/* Feature 3 */}
        <div>
          <h5 className="font-bold text-lg text-slate-800 mb-1">
            Available in Hindi & English
          </h5>
          <p className="text-gray-500 text-sm sm:text-base">
            Use the app in the language you're most comfortable with. Switch
            seamlessly between Hindi and English anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
export default MobileApp;
