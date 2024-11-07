import React, { useState, useEffect } from "react";
import recipes from "../recipes_data.json";
import { styled } from "@mui/material/styles";
import axios from "axios";
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
import * as cookie from "cookie";

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
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [input, setInput] = useState("");
  const [viewLikedOnly, setViewLikedOnly] = useState(false); // New state for liked-only view
  const itemsPerPage = 27;

  const cookies = cookie.parse(document.cookie);
  const userId = cookies.id;

  // Fetch liked recipes when the component mounts
  useEffect(() => {
    const fetchLikedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );
        const user = response.data[0];
        const likes = Array.isArray(user.likes)
          ? user.likes
          : user.likes
          ? JSON.parse(user.likes)
          : [];

        setLikedRecipes(likes);
      } catch (error) {
        console.error("Failed to fetch liked recipes:", error);
      }
    };

    fetchLikedRecipes();
  }, [userId, cookies.token]);

  // Handle the change in the search input field
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  // Handle the filtering by ingredients
  const handleFilter = (e) => {
    e.preventDefault();
    const ingredientArray = input
      .toLowerCase()
      .split(",")
      .map((item) => item.trim());

    const filtered = recipes.filter((recipe) => {
      if (recipe.recipes[0]?.extendedIngredients) {
        return ingredientArray.every((ingredient) => {
          return recipe.recipes[0].extendedIngredients.some((item) => {
            return item.name.toLowerCase().includes(ingredient);
          });
        });
      }
      return false;
    });

    setFilteredRecipes(filtered);
    setCurrentPage(0);
  };

  // Toggle for liking or unliking a recipe
  const handleLikeClick = (recipeId) => {
    setLikedRecipes((prevLikedRecipes) => {
      const isLiked = prevLikedRecipes.includes(recipeId);
      return isLiked
        ? prevLikedRecipes.filter((id) => id !== recipeId)
        : [...prevLikedRecipes, recipeId];
    });
  };

  // Cut off the recipe description at the third period
  const cutOffAtThirdPeriod = (text) => {
    const firstPeriodIndex = text.indexOf(". ");
    const secondPeriodIndex = text.indexOf(". ", firstPeriodIndex + 1);
    const thirdPeriodIndex = text.indexOf(". ", secondPeriodIndex + 1);
    return thirdPeriodIndex !== -1 ? text.slice(0, thirdPeriodIndex + 1) : text;
  };

  // Get the current items based on filtering and liked-only view
  const currentItems = viewLikedOnly
    ? filteredRecipes.filter((recipe) =>
        likedRecipes.includes(recipe.recipes[0].id)
      )
    : filteredRecipes.length > 0
    ? filteredRecipes.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
    : recipes.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Handle pagination
  return (
    <>
      <div style={{ backgroundColor: "#F2D4C6", padding: '10px 0' }}>
        <h2 style={{ marginTop: 10 }}>Filter Recipes by Ingredients</h2>
        <form onSubmit={handleFilter}>
          <label>
            Enter ingredients (comma separated):
            <input type="text" value={input} onChange={handleChange} />
          </label>
          <button type="submit">Filter</button>
        </form>

        {/* New Toggle Button for Liked Recipes */}
        <button onClick={() => setViewLikedOnly((prev) => !prev)}>
          {viewLikedOnly ? "Show All Recipes" : "Show Liked Recipes"}
        </button>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            backgroundColor: "#F2D4C6",
          }}
        >
          {currentItems.map((recipe, index) => (
            <Card
              key={index}
              sx={{
                width: "calc(33.333% - 32px)", // 3 cards per row
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
                height="140"
                image={recipe.recipes[0].image}
                alt={recipe.recipes[0].title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: cutOffAtThirdPeriod(recipe.recipes[0].summary),
                    }}
                  />
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton
                  aria-label="add to favorites"
                  onClick={() => handleLikeClick(recipe.recipes[0].id)}
                >
                  <FavoriteIcon
                    color={
                      likedRecipes.includes(recipe.recipes[0].id)
                        ? "error"
                        : "inherit"
                    }
                  />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
                <ExpandMore
                  expand={!!expanded[index]}
                  onClick={() => setExpanded((prev) => ({ ...prev, [index]: !prev[index] }))}
                  aria-expanded={!!expanded[index]}
                  aria-label="show more"
                >
                  <Typography sx={{ marginBottom: 2 }}>
                    Instructions:
                  </Typography>
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
          pageCount={Math.ceil(
            (filteredRecipes.length > 0 ? filteredRecipes.length : recipes.length) / itemsPerPage
          )}
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
      </div>
    </>
  );
}
