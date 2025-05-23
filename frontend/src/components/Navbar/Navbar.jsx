import React from "react";
import LOGO from "../../assets/images/travelstory.svg";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../Input/SearchBar";

const Navbar = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
}) => {
  const navigate = useNavigate();

  const isToken = localStorage.getItem("token");
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const clearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={LOGO} alt="LOGO" className="h-9 w-[235px]" />
      {isToken && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </>
      )}
    </div>
  );
};

export default Navbar;
