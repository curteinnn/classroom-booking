import background from "../assets/background.JPEG";
import Navbar from "../components/Navbar";

export default function () {
  return (
    <main
      className="min-h-screen relative flex bg-cover"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Navbar />
      <div className="bg-blue-100 flex min-h-screen w-md:w-50 pt-10">
        <button className="justify-center">tes</button>
      </div>
    </main>
  );
}
