import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";

const ProtectedPage = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      dispatch(setAuthModalOpen(true));
    }
  }, [user, dispatch]);

  return user ? children : null;
};

export default ProtectedPage;