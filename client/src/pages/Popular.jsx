import React, { useState, useEffect, useContext } from "react";
import NavHeader from "../components/header";
import { Panel, Loader, IconButton, Icon, Pagination } from "rsuite";
import AnimeContext from "../hooks/animecontext";
import axios from "axios";

function Popular(props) {
  const [popular, setPopular] = useState();
  const [loading, setLoading] = useState(false);
  const { setAnimeContext } = useContext(AnimeContext);
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    getPopularAnime();
  }, [activePage]);

  const getPopularAnime = () => {
    axios
      .get(`/api/v1/anime/popular/fetch/${activePage}`, {
        onDownloadProgress: setLoading(true),
      })
      .then((response) => {
        setPopular(response.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const handleClick = (name) => {
    axios
      .get(`/api/v1/anime/${name}`)
      .then((res) => {
        setAnimeContext({ name: res.data[0].title, url: res.data[0].link });
        props.history.push(`/anime/${res.data[0].title.replace(/\s/g, "-")}`);
      })
      .catch((err) => console.log(err));
  };

  const handlechange = (val) => {
    setActivePage(val);
  };

  return (
    <div className="popular">
      <NavHeader activekey={2} {...props} />
      <div>
        <h4>Popular Anime</h4>
        <Pagination
          prev
          last
          next
          first
          size="md"
          pages={10}
          activePage={activePage}
          onSelect={handlechange}
        />
        <br />
        {loading ? (
          <Loader center size="md" />
        ) : popular ? (
          popular.map((datas) => (
            <>
              <Panel
                shaded
                bordered
                bodyFill
                style={{ display: "inline-block", width: 240 }}
              >
                <img src={datas.img} height="300" />
                <Panel header={datas.name}>
                  <p>
                    <small>{datas.rel}</small>
                    <IconButton
                      icon={<Icon icon="play" />}
                      onClick={() => handleClick(datas.name)}
                    />
                  </p>
                </Panel>
              </Panel>
            </>
          ))
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Popular;
