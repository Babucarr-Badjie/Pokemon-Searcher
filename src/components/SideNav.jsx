import { useState } from "react";
import { first151Pokemon, getFullPokedexNumber } from "../utils/index";
export function SideNav(props) {
  const {
    selectedPokemon,
    setSelectedPokemon,
    handleCloseMenu,
    showHamburgerMenu,
  } = props;

  // set state for searching the pokemon in the input field
  const [searchPokemon, setSearchPokemon] = useState("");

  const filteredPokemon = first151Pokemon.filter((element, elementIndex) => {
    // if the full pokedex number includes the current search value, return true
    if (getFullPokedexNumber(elementIndex).includes(searchPokemon)) {
      return true;
    }
    // if the pokemon number includes the current search value, return true
    if (element.toLowerCase().includes(searchPokemon.toLowerCase())) {
      return true;
    }
    // otherwise, exclude value from the array
    return false;
  });

  return (
    <nav className={" " + (!showHamburgerMenu ? " open" : "")}>
      <div className={"header " + (!showHamburgerMenu ? " open" : "")}>
        <button onClick={handleCloseMenu} className="open-nav-button">
          <i className="fa-solid fa-arrow-left-long"></i>
        </button>
        <h1 className="text-gradient">Pokemon Pokédex</h1>
      </div>
      <input
        style={{ fontSize: "18px" }}
        value={searchPokemon}
        onChange={(event) => {
          setSearchPokemon(event.target.value);
        }}
        placeholder="Search the Pokemon"
      />
      {filteredPokemon.map((pokemon, pokemonIndex) => {
        const truePokedexNumber = first151Pokemon.indexOf(pokemon);
        return (
          <button
            onClick={() => {
              setSelectedPokemon(truePokedexNumber);
              handleCloseMenu();
            }}
            className={
              "nav-card" +
              (pokemonIndex === selectedPokemon ? "nav-card-selected" : "")
            }
            key={pokemonIndex}
          >
            <p>{getFullPokedexNumber(truePokedexNumber)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
}
