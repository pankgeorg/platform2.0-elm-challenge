import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import OpenInNewRoundedIcon from "@material-ui/icons/OpenInNewRounded";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useAPI } from "../hooks/useData";
import { COOL_PROMPTS, PAGE_SIZE_INITIAL, ENDPOINTS } from "../constants";
import Progress from "../components/Progress";
import Error from "../components/Error";
import Empty from "../components/Empty";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "calc(100% - 2em)",
    padding: "1em"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  imageRoot: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  titleBar: {
    cursor: "pointer"
  },
  fabBar: {
    "& > *": {
      margin: theme.spacing(1)
    },
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
    zIndex: "1"
  }
}));
export default function CatsList({ page = 0 }) {
  const classes = useStyles();
  const [showMoreClicked, onClickShowMore] = useState(false);
  const [loading, data, error] = useAPI(
    ENDPOINTS.GET_IMAGE_SEARCH({
      limit: PAGE_SIZE_INITIAL,
      page
    })
  );
  const [isLoading, setIsLoading] = useState(loading);

  // 700ms is about a full circle and much more satisfying if you ask me
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(loading);
    }, 700);
    return () => clearTimeout(timeout);
  }, [loading]);

  if (isLoading) return <Progress />;
  if (error) return <Error />;
  if (data?.length === 0) return <Empty />;
  return (
    <>
      <div className={classes.root}>
        {page === 0 && (
          <Typography variant="h4" gutterBottom>
            Cats for catlovers
          </Typography>
        )}
        {!showMoreClicked && (
          <div className={classes.fabBar}>
            <Fab
              onClick={() => onClickShowMore(true)}
              color="primary"
              aria-label="more"
              variant="extended"
            >
              <AddIcon style={{ fill: "darkblue" }} />
              More 😻😽
            </Fab>
          </div>
        )}
        <div className={classes.imageRoot}>
          <ImageList rowHeight={160} className={classes.imageList} cols={4}>
            {data.map((item) => (
              // TODO: Pack the list
              <ImageListItem
                key={item.url}
                cols={Math.round(Math.random() * 4)}
              >
                <img src={item.url} alt="Another cat!" />
                <ImageListItemBar
                  title={
                    COOL_PROMPTS[
                      Math.round(Math.random() * COOL_PROMPTS.length - 0.5)
                    ]
                  }
                  position="top"
                  actionIcon={
                    <OpenInNewRoundedIcon
                      style={{
                        paddingLeft: 8,
                        paddingRight: 4,
                        marginTop: 4,
                        height: 16,
                        width: 16,
                        fill: "white"
                      }}
                    />
                  }
                  actionPosition="left"
                  className={classes.titleBar}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>
      {showMoreClicked && <CatsList page={page + 1} />}
    </>
  );
}
