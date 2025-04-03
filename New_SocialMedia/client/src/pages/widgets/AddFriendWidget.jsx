import { Box, Typography, useTheme,Divider } from "@mui/material";
import Friend from "../../components/Friend";
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
        method: "get",
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
        variant="h6"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Recommendations
        <Divider sx={{ my: 1 }} />
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem" sx={{ maxHeight: 300, overflowY: "auto" }}>
        { recommendList.map((recommends) => (
          <Friend
            key={recommends._id}
            friendId={recommends._id}
            name={`${recommends.firstName} ${recommends.lastName}`}
            subtitle={recommends.occupation}
            userPicturePath={recommends.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default AddFriendWidget;
