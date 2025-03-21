import { useEffect, useState } from "react";

export function PokeCard(props) {
  const { selectedPokemon } = props;

  // stateful variable
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if loading, exit logic
    if (loading || !localStorage) {
      return;
    }

    // check if the selected pokemon information is available in the cache
    // 1. define the cache
    let cache = {};

    if (localStorage.getItem("pokedex")) {
      cache = localStorage.getItem("pokemon");
    }
    // 2. check if the selected pokemon is in the cache, otherwise fetch it from the API
    if (selectedPokemon in cache) {
      // read from cache
      setData(cache[selectedPokemon]);
      return;
    }

    // if we fetch from the api, make sure to save the information to the cache for next time
  }, [selectedPokemon,loading]);

  return <div></div>;
}
