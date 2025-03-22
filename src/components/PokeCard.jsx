import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import { TypeCard } from "./TypeCard";
import { Modal } from "./Modal";

export function PokeCard(props) {
  const { selectedPokemon } = props;

  // stateful variable
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  const imgList = Object.keys(sprites || {}).filter((value) => {
    if (!sprites[value]) {
      return false;
    }
    if (["versions", "other"].includes(value)) {
      return false;
    }
    return true;
  });

  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) {
      return;
    }
    // check cache for move
    let moveCache = {};
    if (localStorage.getItem("pokemon-moves")) {
      moveCache = JSON.parse(localStorage.getItem("pokemon-moves"));
    }
    if (move in moveCache) {
      setSkill(moveCache[move]);
      console.log("found move in cache");
      return;
    }
    try {
      setLoadingSkill(true);
      const res = await fetch(moveUrl);
      const moveData = await res.json();
      console.log("Fetched move from API", moveData);

      const description = moveData?.flavor_text_entries.filter((value) => {
        return (value.version_group.name = "firered-leafgreen");
      })[0]?.flavor_text;

      const skillData = {
        name: move,
        description,
      };
      setSkill(skillData);
      moveCache[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(moveCache));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSkill(false);
    }
  }

  useEffect(() => {
    // if loading, exit logic
    if (loading || !localStorage) {
      return;
    }

    // check if the selected pokemon information is available in the cache
    // 1. define the cache
    let cache = {};

    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }
    // 2. check if the selected pokemon is in the cache, otherwise fetch it from the API
    if (selectedPokemon in cache) {
      // read from cache
      setData(cache[selectedPokemon]);
      console.log("found pokemon in cache");
      return;
    }

    // we passed all the cache stuff to no avail and now need to fetch the data from the api
    async function fetchPokemonData() {
      setLoading(true);

      // try block
      try {
        const baseUrl = "https://pokeapi.co/api/v2/";
        const suffixUrl = "pokemon/" + getPokedexNumber(selectedPokemon);
        const finalUrl = baseUrl + suffixUrl;
        const res = await fetch(finalUrl);
        const pokemonData = await res.json();
        setData(pokemonData);
        console.log("fetch pokemon data");

        // update the cache data
        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));

        // catch block
      } catch (err) {
        console.log(err.message);

        // finally block
      } finally {
        setLoading(false);
      }
    }

    // invoke the fetchPokemonData function
    fetchPokemonData();

    // if we fetch from the api, make sure to save the information to the cache for next time
  }, [selectedPokemon]);

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="poke-card">
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null);
          }}
        >
          <div>
            <h6>Name</h6>
            <h2 className="skill-name">{skill.name.replaceAll("-", " ")}</h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className="type-container">
        {types.map((typeObj, typeIndex) => {
          return <TypeCard key={typeIndex} type={typeObj?.type?.name} />;
        })}
      </div>
      <img
        className="default-img"
        src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"}
        alt={`${name}-large-img`}
      />
      <div className="img-container">
        {imgList.map((spriteUrl, spriteIndex) => {
          const imgUrl = sprites[spriteUrl];
          return (
            <img
              key={spriteIndex}
              src={imgUrl}
              alt={`${name}-img-${spriteUrl}`}
            />
          );
        })}
      </div>

      {/* display tats */}
      <h3>Stats</h3>
      <div className="stats-card">
        {stats.map((statObj, statIndex) => {
          const { stat, base_stat } = statObj;
          return (
            <div className="stat-item" key={statIndex}>
              <p>{stat?.name.replaceAll("-", " ")}</p>
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>

      {/* display moves */}
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves.map((moveObj, moveIndex) => {
          return (
            <button
              className="button-card pokemon-move"
              key={moveIndex}
              onClick={() => {
                fetchMoveData(moveObj?.move?.name, moveObj?.move.url);
              }}
            >
              <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
