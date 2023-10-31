import './App.css';
import Weather from './Organisms/CurrentLocation';

function App() {
  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen text-gray-700 p-10 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 ">
      <Weather></Weather>
    </div>
  );
}

export default App;
