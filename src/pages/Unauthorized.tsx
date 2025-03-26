
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <ShieldAlert className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        You don't have permission to access this page. If you believe this is an error, please contact your administrator.
      </p>
      <Button onClick={() => navigate('/')}>
        <Home className="mr-2 h-4 w-4" />
        Go to Home
      </Button>
    </div>
  );
};

export default Unauthorized;
