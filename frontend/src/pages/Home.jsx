import background from "../assets/background.JPEG";
import Navbar from "../components/Navbar";

export default function () {
  return (
    <main
<<<<<<< HEAD
      className="min-h-screen relative flex flex-col justify-center items-center px-6 bg-cover"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Navbar />
      <div className="bg-white mt-30 rounded-lg h-70 w-100 pt-10 md:w-150 md:h-100">
        <img src="" alt="" />
      </div>

      <section className="bg-white min-h-screen w-screen mt-30"></section>
=======
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
>>>>>>> feature/home
    </main>
  );
}
