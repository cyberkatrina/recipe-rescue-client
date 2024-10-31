import React, { useState } from "react";
import recipes from "../recipes_data.json";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReactPaginate from "react-paginate";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  ...(props) => ({
    transform: props.expand ? "rotate(180deg)" : "rotate(0deg)",
  }),
}));

export function Recipes() {
  const [expanded, setExpanded] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 27;
  const offset = currentPage * itemsPerPage;
  const currentItems = recipes.slice(offset, offset + itemsPerPage);

  const handleExpandClick = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const cutOffAtThirdPeriod = (text) => {
    const firstPeriodIndex = text.indexOf(". ");
    const secondPeriodIndex = text.indexOf(". ", firstPeriodIndex + 1);
    const thirdPeriodIndex = text.indexOf(". ", secondPeriodIndex + 1);

    if (thirdPeriodIndex !== -1) {
      return text.slice(0, thirdPeriodIndex + 1);
    }

    return text; // Return the original text if there are less than 3 periods
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          backgroundColor: '#F2D4C6'
        }}
      >
        {currentItems.map((recipe, index) => (
          <Card
            key={index}
            sx={{
              width: "25%",
              margin: "16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardHeader
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={recipe.recipes[0].title}
              subheader={recipe.recipes[0].diets.join(", ") || ""}
            />
            <CardMedia
              component="img"
              height="20%"
              width='20%'
              image={recipe.recipes[0].image}
              alt={recipe.recipes[0].title}
            />
            <CardContent sx={{ flexGrow: 1, paddingBottom: 0, marginBottom: 0}}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: cutOffAtThirdPeriod(recipe.recipes[0].summary),
                  }}
                />
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <ExpandMore
                expand={!!expanded[index]}
                onClick={() => handleExpandClick(index)}
                aria-expanded={!!expanded[index]}
                aria-label="show more"
              >
                <Typography sx={{ marginBottom: 2 }}>Instructions:</Typography>
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={!!expanded[index]} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: recipe.recipes[0].instructions,
                    }}
                  />
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </div>

      <ReactPaginate
        pageCount={Math.ceil(recipes.length / itemsPerPage)}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        onPageChange={(selected) => setCurrentPage(selected.selected)}
        containerClassName={"pagination"}
        activeClassName={"active"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
      />
    </>
  );
}