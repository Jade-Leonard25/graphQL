
import Navbar from './navbar';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router';
import DrawBoard from './drawboard';
const Dashboard = () => {
  const { user } = useAuth();
  const params = useParams();

  return (
    <div className="text-zinc-200">
      <Navbar />
      <div className="  dark:text-zinc-100 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 flex flex-col min-h-screen">
        <DrawBoard />
      </div>
    </div>
  );
};

export default Dashboard;