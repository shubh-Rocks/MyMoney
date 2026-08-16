import RecentPayment from "@/components/dashboard/components/RecentPayment";

export default function () {
  return (
    <div>
      <div className="py-3 flex flex-col gap-3 ">
        <h2 className="font-bold text-2xl">Recent Payments</h2>
        <p className="text-base text-gray-500">
          Every payments your borrower have made, tracked and reconciled
          automatically
        </p>
        <RecentPayment />
      </div>
    </div>
  );
}
