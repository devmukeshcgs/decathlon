import { appleImg, bagImg, searchImg } from '../utils';
import { navLists } from '../constants';

const Navbar = () => {
  return (
    <header className="w-full bg-transparent py-5 sm:px-10 px-5 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <nav className="flex w-full screen-max-width bg-transparent">
        {/* <img src={appleImg} alt="Forum" width={100} height={"auto"} /> */}

        <div className="flex flex-1 justify-center items-center max-sm:hidden bg-transparent">
          {navLists.map((nav) => (
            <div key={nav} className="px-5 text-sm cursor-pointer text-white hover:text-black transition-all">
              {nav}
            </div>
          ))}
          {/* <button
            className="align-middle select-none font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-1 px-3 border border-gray-900 text-gray-900 hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] rounded-full"
            type="button">
            Sign Up
          </button> */}
        </div>

      </nav>
    </header>
  )
}

export default Navbar 