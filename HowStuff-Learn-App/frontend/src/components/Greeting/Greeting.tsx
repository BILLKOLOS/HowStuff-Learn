import { Typography } from '@mui/material';
import { useAuthStore } from '@/store/slices/authSlice';

const getTimeOfDay = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return 'Good Morning';
  if (currentHour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const Greeting = () => {
  const { user } = useAuthStore();
  const username = user?.username || 'User';
  const progress = typeof user?.progress === 'number' ? user.progress : 0; // Ensure progress is a number
  const timeOfDay = getTimeOfDay();

  return (
    <div>
      <Typography variant="h4">{`${timeOfDay}, ${username}!`}</Typography>
      <Typography variant="subtitle1">
        {`Your progress: ${progress}%`}
      </Typography>
    </div>
  );
};

export default Greeting;
