import { first151Pokemon, getFullPokedexNumber } from "../utils/index";
export function SideNav() {
  return (
    <nav>
      <div className={"header"}>
        <h1 className="text-gradient">Pokédex</h1>
     
        <input />
      </div>
      {first151Pokemon.map((pokemon, pokemonIndex) => {
        return (
          <button className={"nav-card"} key={pokemonIndex}>
            <p>{getFullPokedexNumber(pokemonIndex)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
}
