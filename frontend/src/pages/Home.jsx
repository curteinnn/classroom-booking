import background from "../assets/background.JPEG";
import Navbar from "../components/Navbar";

export default function () {
  return (
    <main
      className="home min-h-screen flex items-center justify-center px-6 bg-cover"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Navbar />

      <div className="card1 bg-white h-80 w-80 rounded-lg">
        <h1 className="title text-black text-center py-4">Rooms</h1>

        <div className="rooms bg-gray-500 w-80 h-70">
          <img src="" alt="" />
        </div>
      </div>
    </main>
  );
}
