import { Header } from "./components/Header";
import { SideNav } from "./components/SideNav";
import { PokeCard } from "./components/PokeCard";
import { useState } from "react";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(true);

  function handleToggleMenu() {
    setShowHamburgerMenu(!showHamburgerMenu);
  }

  function handleCloseMenu() {
    setShowHamburgerMenu(true);
  }
  return (
    <>
      <Header handleToggleMenu={handleToggleMenu} />
      <SideNav
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
        handleCloseMenu={handleCloseMenu}
        showHamburgerMenu={showHamburgerMenu}
      />
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  );
}

export default App;
