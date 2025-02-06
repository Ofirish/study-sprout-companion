export const DashboardHeader = () => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Homework Tracker
          </h1>
          <p className="text-sm text-gray-600">
            Keep track of all your assignments and tests in one place
          </p>
        </div>
      </div>
    </div>
  );
};