const Navbar = () => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">
      <h1 className="text-xl font-bold">
        G5 Group ERP
      </h1>

      <div>
        <p>{user?.fullName}</p>
      </div>
    </div>
  );
};

export default Navbar;