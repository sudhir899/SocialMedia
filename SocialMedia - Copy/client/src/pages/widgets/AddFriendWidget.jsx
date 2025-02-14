import { Box, Typography, useTheme } from "@mui/material";
import FriendRecommend from "../../components/FriendRecommend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRecommendation } from "../../state";


const AddFriendWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const recommendList = useSelector((state) => state.recommendList);

  const getRecommendList = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/recommend`,
      {
        method: "patch",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setRecommendation({ recommendList: data }));
  };

  useEffect(() => {
    getRecommendList();
  }, []); 

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Recommendations
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        <h3>Recommendation will come here</h3>
        { recommendList.map((user) => (
          <FriendRecommend
            key={user._id}
            userId={user._id}
            name={`${user.firstName} ${user.lastName}`}
            subtitle={user.occupation}
            userPicturePath={user.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default AddFriendWidget;
