function Loader({ loading }: { loading: boolean }) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-30">
      <div className="absolute z-1 w-full h-screen bg-black bg-opacity-75"></div>
      <div className="z-5 loader"></div>
    </div>
  );
}

export default Loader;
